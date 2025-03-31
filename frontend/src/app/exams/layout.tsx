"use client";
import { ReactNode } from "react";

export default function ExamsLayout({ children }: { children: ReactNode }) {
	return <div className="space-y-8">{children}</div>;
}
