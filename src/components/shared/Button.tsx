import React from "react"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  icon?: string
  type?: "button" | "submit"
  className?: string
}

export default function Button({ children, onClick, icon, type = "button", className = "" }: ButtonProps) {
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
          color: #1BA5B2;
          padding: 0.7em 1.7em;
          cursor: pointer;
          font-size: 18px;
          border-radius: 0.5em;
          background: #e8e8e8;
          border: 1px solid #e8e8e8;
          box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #FEFDFD;
          font-family: "Positions", cursive;
          font-weight: 600;
        }
        .aqua-button:active {
          color: #666;
          box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
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
          background-color: #1BA5B2;
          border-radius: 50%;
          display: block;
          transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
          z-index: -1;
        }
        .aqua-button:hover {
          color: #ffffff;
          border: 1px solid #1BA5B2;
        }
        .aqua-button:hover:before {
          top: -35%;
          background-color: #1BA5B2;
          transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
        }
        .aqua-button:hover:after {
          top: -45%;
          background-color: #1BA5B2;
          transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
        }
      `}</style>
      <button
        type={type}
        onClick={onClick}
        className={`aqua-button ${className}`}
      >
        {icon && <i className={icon} />}
        {children}
      </button>
    </>
  )
}