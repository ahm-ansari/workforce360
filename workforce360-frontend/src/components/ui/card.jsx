import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow p-5 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`mb-4 border-b pb-2 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h2 className={`text-xl font-semibold text-slate-800 ${className}`}>
    {children}
  </h2>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);
