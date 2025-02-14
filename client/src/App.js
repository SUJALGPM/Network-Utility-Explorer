"use client"

import { useState } from "react"
import { Toaster, toast } from "react-hot-toast"

const API_URL = "http://localhost:8200/executeCommand"


const commands = ["IPCONFIG", "NETSTAT", "PING", "NSLOOKUP", "TRACEROUTE", "ARP", "NETSH", "HOSTNAME", "GETMAC", "ROUTE PRINT"];

const descriptions = {
  IPCONFIG: "Displays network interface configuration",
  NETSTAT: "Displays network connections and routing tables",
  PING: "Tests reachability of a host",
  NSLOOKUP: "Queries DNS for IP/domain mapping",
  TRACEROUTE: "Traces packet route to a host",
  ARP: "Displays ARP table",
  NETSH: "Configures network settings",
  HOSTNAME: "Displays the computer's name",
  GETMAC: "Displays MAC addresses",
  "ROUTE PRINT": "Displays routing table",
};


function App() {
  const [activeCommand, setActiveCommand] = useState("IPCONFIG")
  const [commandOutput, setCommandOutput] = useState("")

  const executeCommand = async () => {
    let target = ""

    if (["PING", "TRACEROUTE", "NSLOOKUP"].includes(activeCommand)) {
      target = prompt(`Enter IP address or domain for ${activeCommand}:`)
      if (!target) {
        toast.error("You must enter a valid IP address or domain.")
        return
      }
    }

    toast.success(`Executing ${activeCommand}...`)
    setCommandOutput("Running...")

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cmd: activeCommand, target }),
      })

      const data = await response.json()
      setCommandOutput(data.output || "No output received.")
    } catch (error) {
      setCommandOutput("Error executing command.")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0D1117",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "2.5rem",
        paddingBottom: "2.5rem",
      }}
    >
      <Toaster position="bottom-right" />
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "bold",
          color: "#58A6FF",
        }}
      >
        Network Utility Command Explorer
      </h1>
      <h2
        style={{
          fontSize: "1.125rem",
          color: "#94A3B8",
          marginTop: "0.5rem",
        }}
      >
        Execute network commands via API
      </h2>

      <div
        style={{
          backgroundColor: "#161B22",
          padding: "1.5rem",
          marginTop: "1.5rem",
          borderRadius: "0.5rem",
          width: "75%",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #2D3748",
          }}
        >
          {commands.map((cmd) => (
            <button
              key={cmd}
              style={{
                padding: "0.5rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "all 0.2s",
                backgroundColor: activeCommand === cmd ? "#1F6FEB" : "transparent",
                color: activeCommand === cmd ? "white" : "#94A3B8",
                borderTopLeftRadius: activeCommand === cmd ? "0.375rem" : "0",
                borderTopRightRadius: activeCommand === cmd ? "0.375rem" : "0",
              }}
              onClick={() => setActiveCommand(cmd)}
            >
              {cmd}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <h3
            style={{
              fontSize: "1.5rem",
              color: "#58A6FF",
              fontWeight: "600",
            }}
          >
            {activeCommand}
          </h3>
          <p
            style={{
              color: "#94A3B8",
              marginTop: "0.5rem",
            }}
          >
            {descriptions[activeCommand]}
          </p>
          <button
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1.5rem",
              backgroundColor: "#238636",
              color: "white",
              fontWeight: "600",
              borderRadius: "0.375rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: "all 0.2s",
            }}
            onClick={executeCommand}
          >
            Try {activeCommand}
          </button>
          <div
            style={{
              marginTop: "1.5rem",
              backgroundColor: "black",
              color: "white",
              padding: "1rem",
              borderRadius: "0.375rem",
              width: "100%",
              border: "1px solid #2D3748",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#4ADE80",
              }}
            >
              Output:
            </h4>
            <pre
              style={{
                color: "#D1D5DB",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                backgroundColor: "#0D1117",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid #4B5563",
                maxHeight: "20rem",
                overflow: "auto",
              }}
            >
              {commandOutput
                ? commandOutput.replace(/Request timed out./g, "🔴 Request timed out.").replace(/(\d+ ms)/g, "🟢 $1")
                : "No output yet..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

