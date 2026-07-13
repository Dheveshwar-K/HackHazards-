import subprocess
import sys
import os
import time
import signal

def main():
    print("=" * 60)
    print("   OCEANMIND AI COMMAND CENTER PLATFORM LAUNCHER")
    print("=" * 60)
    
    workspace = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Start FastAPI Backend Process
    print("\n[System] Starting FastAPI Backend on port 8000...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--port", "8000"]
    try:
        backend_proc = subprocess.Popen(
            backend_cmd,
            cwd=workspace,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
    except Exception as e:
        print(f"[Error] Failed to launch backend: {e}")
        sys.exit(1)
        
    # Wait a bit for backend to start up
    time.sleep(1.5)
    
    # 2. Start Vite Frontend Process
    print("[System] Starting Vite Frontend on port 5173...")
    # On Windows, npm is npm.cmd
    npm_cmd = "npm.cmd" if os.name == 'nt' else "npm"
    frontend_cmd = [npm_cmd, "run", "dev"]
    try:
        frontend_proc = subprocess.Popen(
            frontend_cmd,
            cwd=workspace,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
    except Exception as e:
        print(f"[Error] Failed to launch frontend: {e}")
        backend_proc.terminate()
        sys.exit(1)
        
    print("\n" + "-" * 50)
    print("  FASTAPI:  http://localhost:8000")
    print("  FRONTEND: http://localhost:5173")
    print("  Press Ctrl+C to terminate both servers.")
    print("-" * 50 + "\n")
    
    # Non-blocking log reading loop
    import select
    
    # Set streams to non-blocking
    if os.name != 'nt':
        # On Unix, we can use select
        import fcntl
        for proc in (backend_proc, frontend_proc):
            fd = proc.stdout.fileno()
            fl = fcntl.fcntl(fd, fcntl.F_GETFL)
            fcntl.fcntl(fd, fcntl.F_SETFL, fl | os.O_NONBLOCK)
            
        try:
            while True:
                rlist, _, _ = select.select([backend_proc.stdout, frontend_proc.stdout], [], [], 0.1)
                for stream in rlist:
                    line = stream.readline().strip()
                    if line:
                        prefix = "[Backend] " if stream == backend_proc.stdout else "[Frontend] "
                        print(prefix + line)
                if backend_proc.poll() is not None or frontend_proc.poll() is not None:
                    break
        except KeyboardInterrupt:
            print("\n[System] Shutdown requested...")
    else:
        # On Windows, select doesn't work on pipes, so use simple threading or polling
        # Since this is a launcher script, we will print a message and keep polling stdout lines
        import threading
        
        def pipe_reader(pipe, prefix):
            try:
                for line in iter(pipe.readline, ''):
                    if not line:
                        break
                    print(f"{prefix}{line.strip()}", flush=True)
            except Exception:
                pass
                
        t1 = threading.Thread(target=pipe_reader, args=(backend_proc.stdout, "[Backend] "), daemon=True)
        t2 = threading.Thread(target=pipe_reader, args=(frontend_proc.stdout, "[Frontend] "), daemon=True)
        t1.start()
        t2.start()
        
        try:
            while backend_proc.poll() is None and frontend_proc.poll() is None:
                time.sleep(0.5)
        except KeyboardInterrupt:
            print("\n[System] Shutdown signal received. Stopping servers...")
            
    # Terminate both processes cleanly
    for proc in (backend_proc, frontend_proc):
        try:
            if os.name == 'nt':
                # Windows taskkill is cleaner for child process trees
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                proc.terminate()
                proc.wait(timeout=2)
        except Exception:
            pass
            
    print("[System] Platform stopped successfully.")

if __name__ == "__main__":
    main()
