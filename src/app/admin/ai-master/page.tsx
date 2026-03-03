"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Activity, CheckSquare, Zap, Clock, RefreshCw } from "lucide-react";
import { io } from "socket.io-client";

type ChangeRequest = {
    id: string;
    requestId: string;
    changeType: string;
    pageCategory: string;
    targetPage: string;
    riskScore: string;
    currentState: string;
    overrideFlag: boolean;
    createdAt: string;
};

type SystemStatus = {
    mode: string;
    lastRiskScan: string | null;
    systemHealthStatus: string;
};

export default function AIMasterPanel() {
    const [requests, setRequests] = useState<ChangeRequest[]>([]);
    const [systemState, setSystemState] = useState<SystemStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Connect to Socket.IO server
        const socket = io({
            path: "/ws/ai-status",
        });

        socket.on("connect", () => {
            console.log("[AI PANEL] Connected to Live System");
            // Set basic state to show we're live
            setSystemState({
                mode: "normal",
                lastRiskScan: new Date().toISOString(),
                systemHealthStatus: "healthy - live connection"
            });
            setIsLoading(false);
        });

        // Listen for execution queue updates
        socket.on("change_requests", (data: ChangeRequest[]) => {
            setRequests(data);
        });

        // Listen for system state changes
        socket.on("system_state", (state: SystemStatus) => {
            setSystemState(state);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (isLoading) return <div className="p-8">Loading AI Governance Panel...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        🧠 AI Master Control Panel
                    </h1>
                    <p className="text-gray-500 mt-1">Multi-Agent Governance & Approval System</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mode Control Dropdown (Mocked) */}
                    <select
                        className="border p-2 rounded-lg bg-gray-50 font-medium"
                        value={systemState?.mode || "normal"}
                        onChange={() => { }}
                    >
                        <option value="normal">🟢 Normal Mode</option>
                        <option value="emergency">🔴 Emergency Mode</option>
                        <option value="maintenance">🟡 Maintenance Mode</option>
                    </select>

                    <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium border border-red-200 hover:bg-red-100 transition flex items-center gap-2">
                        <RefreshCw size={16} />
                        Reset Strategic Memory
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    icon={<CheckSquare className="text-blue-500" />}
                    label="Pending Approvals"
                    value="2"
                />
                <MetricCard
                    icon={<ShieldAlert className="text-orange-500" />}
                    label="Risk Level"
                    value="Severe Alert"
                    sub="1 high-risk item pending"
                />
                <MetricCard
                    icon={<Activity className="text-green-500" />}
                    label="System Health"
                    value={systemState?.systemHealthStatus || "Unknown"}
                />
                <MetricCard
                    icon={<Clock className="text-purple-500" />}
                    label="Last Deep Scan"
                    value="2 mins ago"
                />
            </div>

            {/* Approval Queue Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Zap size={20} className="text-yellow-500" />
                        Execution Approval Queue
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                            <tr>
                                <th className="p-4">Request ID</th>
                                <th className="p-4">Change Type</th>
                                <th className="p-4">Target Page</th>
                                <th className="p-4">Risk Score</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-4 font-mono text-sm">{req.requestId}</td>
                                    <td className="p-4">
                                        <span className="capitalize text-sm font-medium">{req.changeType}</span>
                                    </td>
                                    <td className="p-4 text-sm font-medium">{req.targetPage}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.riskScore === 'severe' ? 'bg-red-100 text-red-700' :
                                            req.riskScore === 'high' ? 'bg-orange-100 text-orange-700' :
                                                req.riskScore === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {req.riskScore.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-medium px-2 py-1 rounded bg-blue-50 text-blue-700">
                                            {req.currentState.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1">View</button>
                                        {req.currentState === "boss_pending" && (
                                            <button className="text-sm font-medium bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800 transition shadow-sm">
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub?: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-gray-50 p-2 rounded-lg">
                    {icon}
                </div>
                <div className="text-gray-500 font-medium text-sm">{label}</div>
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {sub && <div className="text-sm text-red-500 mt-1">{sub}</div>}
        </div>
    )
}
