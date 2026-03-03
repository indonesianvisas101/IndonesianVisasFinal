"use client";

import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { X, ArrowRight, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { VisaType } from "@/constants/visas";
import { useApplication } from "@/components/application/ApplicationContext";

interface VisaListModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    filterType: "visit" | "single" | "multiple" | "kitas";
}

const VisaListModal = ({ isOpen, onClose, title, description, filterType }: VisaListModalProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const { visas } = useApplication();

    const filteredVisas = useMemo(() => {
        return visas.filter((visa) => {
            if (filterType === "visit") {
                return (
                    visa.category.includes("Exemptions") ||
                    visa.category.includes("Visas on Arrival")
                );
            }
            if (filterType === "single") {
                return visa.category.includes("Single-Entry");
            }
            if (filterType === "multiple") {
                return visa.category.includes("Multiple-Entry");
            }
            if (filterType === "kitas") {
                return (
                    visa.category.includes("Work") ||
                    visa.category.includes("Investor") ||
                    visa.category.includes("Student") ||
                    visa.category.includes("Family") ||
                    visa.category.includes("Repatriation") ||
                    visa.category.includes("Residency")
                );
            }
            return false;
        });
    }, [visas, filterType]);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            fullScreen={fullScreen}
            PaperProps={{
                className: "glass-card",
                style: {
                    borderRadius: fullScreen ? 0 : 24,
                    background: theme.palette.mode === 'dark' ? '#0f172a' : '#ffffff',
                    backgroundImage: 'none'
                }
            }}
        >
            <div className="relative p-6 border-b border-gray-100 dark:border-white/10">
                <DialogTitle sx={{ p: 0, fontSize: "1.5rem", fontWeight: 800 }}>
                    {title}
                </DialogTitle>
                <p className="text-gray-500 mt-1 pr-8">{description}</p>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 16,
                        top: 16,
                        color: "text.primary"
                    }}
                >
                    <X />
                </IconButton>
            </div>

            <DialogContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVisas.map((visa) => (
                        <Link href={`/services/${visa.id}`} key={visa.id} onClick={onClose} className="group">
                            <div className="h-full p-5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-primary/10 text-primary">
                                        ID: {visa.id}
                                    </span>
                                    <ArrowRight className="text-gray-300 group-hover:text-primary transition-colors" size={20} />
                                </div>

                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors dark:text-white">
                                    {visa.name}
                                </h3>

                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                    {visa.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-primary" />
                                        <span>{visa.validity}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>{visa.extendable ? "Extendable" : "No Extension"}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {filteredVisas.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                            No visas found for this category.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VisaListModal;
