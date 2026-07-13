import React, { useState } from "react";

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleBiometricLogin = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate biometric analysis scan
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            onLoginSuccess();
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-almost-black cyber-grid overflow-hidden">
      {/* Background glowing rings */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Cyber Scan line */}
      <div className="absolute left-0 right-0 h-[2px] bg-cyan-400/10 scan-line pointer-events-none" />

      {/* Form Container */}
      <div className="w-full max-w-md mx-4 relative z-10 glass-panel rounded-2xl border border-cyan-400/25 p-8 shadow-2xl backdrop-blur-2xl">
        
        {/* Header HUD */}
        <div className="text-center mb-8">
          <span className="text-[10px] text-cyan-400 font-numeric font-bold uppercase tracking-widest block mb-1">
            Secure Terminal Portal
          </span>
          <h2 className="text-2xl font-bold font-orbitron text-slate-100 tracking-wider">
            OCEANMIND AI
          </h2>
          <p className="text-xs font-sub text-slate-400 mt-1">
            Global Maritime Intelligence Gateway
          </p>
        </div>

        {/* Biometric Verification Box */}
        <div className="bg-primary/30 border border-cyan-400/15 rounded-xl p-6 text-center mb-6 flex flex-col items-center gap-4 relative overflow-hidden">
          {isScanning && (
            <div className="absolute inset-0 bg-cyan-400/5 animate-[pulse_1.5s_infinite] pointer-events-none" />
          )}

          {/* Fingerprint Symbol */}
          <button
            onClick={handleBiometricLogin}
            disabled={isScanning}
            className={`w-20 h-20 rounded-full border border-cyan-400/40 flex items-center justify-center transition-all duration-300 relative ${
              isScanning 
                ? "border-accent shadow-[0_0_20px_rgba(0,255,157,0.3)]" 
                : "hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer"
            }`}
          >
            <span className={`text-4xl select-none ${isScanning ? "animate-pulse" : ""}`}>
              {isScanning ? "🧬" : "👆"}
            </span>
            {isScanning && (
              <div className="absolute inset-0 rounded-full border border-accent border-t-transparent animate-spin" />
            )}
          </button>

          <div>
            <h3 className="text-xs font-orbitron font-bold text-slate-200">
              {isScanning ? "SCANNING RETINAL & BIOMETRIC SIGNATURE..." : "BIOMETRIC AUTHENTICATION"}
            </h3>
            <p className="text-[10px] font-sub text-slate-400 mt-1">
              {isScanning ? `${scanProgress}% Match Complete` : "Click sensor to bypass with standard credentials simulation"}
            </p>
          </div>

          {/* Scan Progress Bar */}
          {isScanning && (
            <div className="w-full bg-cyan-400/10 h-1 rounded overflow-hidden mt-2">
              <div 
                className="bg-accent h-full transition-all duration-75"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          )}
        </div>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-cyan-400/10"></div>
          <span className="flex-shrink mx-4 text-[9px] font-numeric text-slate-500 uppercase tracking-widest">or bypass</span>
          <div className="flex-grow border-t border-cyan-400/10"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleStandardSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-numeric text-slate-400 block mb-1 uppercase tracking-widest">
              Operator ID
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., COMMAND_OFFICER"
              className="w-full bg-black/60 border border-cyan-400/20 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-sub transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-numeric text-slate-400 block mb-1 uppercase tracking-widest">
              Access Code
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/60 border border-cyan-400/20 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-sub transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/40 text-cyan-400 py-2.5 rounded-lg text-xs font-orbitron font-bold uppercase tracking-wider transition-colors shadow-[0_0_10px_rgba(0,229,255,0.05)] cursor-pointer"
          >
            Authenticate Operator
          </button>
        </form>

        {/* Footer telemetry */}
        <div className="mt-8 text-center text-[9px] font-numeric text-slate-500">
          SYS_SECURE_TOKEN: ACTIVE // SEC_LEVEL: ALPHA
        </div>
      </div>
    </div>
  );
};
