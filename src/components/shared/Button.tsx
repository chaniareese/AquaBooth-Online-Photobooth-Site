import React from "react"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  icon?: string
  type?: "button" | "submit"
  className?: string
  disabled?: boolean
}

export default function Button({ children, onClick, icon, type = "button", className = "", disabled = false }: ButtonProps) {
  return (
    <>
      <style>{`
        .aqua-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease-in;
          position: relative;
          overflow: hidden;
          z-index: 1;
          color: #e8e8e8;
          padding: 0.7em 1.7em;
          cursor: pointer;
          font-size: 22px;
          border-radius: 0;
          background: #1BA5B2;
          border: none;
          box-shadow: 6px 6px 12px #c5c5c5;
          font-family: "Positions", cursive;
          font-weight: 500;
        }
        .aqua-button:active {
          color: #666;
          box-shadow: inset 4px 4px 12px #c5c5c5;
        }
        .aqua-button:before {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%) scaleY(1) scaleX(1.25);
          top: 100%;
          width: 140%;
          height: 180%;
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 50%;
          display: block;
          transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
          z-index: -1;
        }
        .aqua-button:after {
          content: "";
          position: absolute;
          left: 55%;
          transform: translateX(-50%) scaleY(1) scaleX(1.45);
          top: 180%;
          width: 160%;
          height: 190%;
          background-color: #e8e8e8;
          border-radius: 50%;
          display: block;
          transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
          z-index: -1;
        }
        .aqua-button:hover {
          color: #1BA5B2;
          border: none;
        }
        .aqua-button:hover:before {
          top: -35%;
          background-color: #1BA5B2;
          transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
        }
        .aqua-button:hover:after {
          top: -45%;
          background-color: #e8e8e8;
          transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
        }
      `}</style>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`aqua-button ${className}`}
          style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      >
        {icon && <i className={icon} />}
        {children}
      </button>
    </>
  )
}