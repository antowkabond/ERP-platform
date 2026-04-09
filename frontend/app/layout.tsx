import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Navigation } from "@/components/layout/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ERP/Accounting System",
  description: "Modular ERP and Accounting Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          *{box-sizing:border-box;margin:0;padding:0}
          html,body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1f2937;background-color:#f9fafb}
          h1{font-size:1.875rem;font-weight:700}h2{font-size:1.5rem;font-weight:600}
          a{color:#3b82f6;text-decoration:none}a:hover{text-decoration:underline}
          .p-4{padding:1rem}.p-6{padding:1.5rem}.p-8{padding:2rem}
          .px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}
          .py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}
          .mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}
          .mr-1{margin-right:.25rem}.ml-10{margin-left:2.5rem}.mt-2{margin-top:.5rem}.pt-4{padding-top:1rem}
          .flex{display:flex}.inline-flex{display:inline-flex}.items-center{align-items:center}.items-end{align-items:flex-end}
          .justify-between{justify-content:space-between}.justify-end{justify-content:flex-end}.flex-col{flex-direction:column}
          .gap-1{gap:.25rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}
          .space-y-4>*+*{margin-top:1rem}.space-y-6>*+*{margin-top:1.5rem}.space-x-4>*+*{margin-left:1rem}
          .grid{display:grid}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
          .grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
          .grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.col-span-2{grid-column:span 2/span 2}
          .w-full{width:100%}.w-48{width:12rem}.h-10{height:2.5rem}.h-12{height:3rem}.h-16{height:4rem}
          .min-h-screen{min-height:100vh}.max-w-4xl{max-width:56rem}.max-w-5xl{max-width:64rem}.max-w-7xl{max-width:80rem}
          .mx-auto{margin-left:auto;margin-right:auto}
          .text-primary{color:#3b82f6}.text-muted-foreground{color:#6b7280}.text-destructive{color:#ef4444}
          .text-blue-800{color:#1e40af}.text-green-700{color:#15803d}.text-green-800{color:#166534}.text-purple-800{color:#6b21a8}
          .bg-background{background-color:white}.bg-accent{background-color:#f3f4f6}
          .bg-blue-100{background-color:#dbeafe}.bg-green-50{background-color:#f0fdf4}.bg-green-100{background-color:#dcfce7}
          .bg-purple-100{background-color:#f3e8ff}.bg-green-500{background-color:#22c55e}.border-green-200{border-color:#bbf7d0}
          .text-xs{font-size:.75rem}.text-sm{font-size:.875rem}.text-2xl{font-size:1.5rem}.text-3xl{font-size:1.875rem}.text-4xl{font-size:2.25rem}
          .font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}
          .text-left{text-align:left}.text-right{text-align:right}
          .border{border:1px solid #e5e7eb}.border-b{border-bottom:1px solid #e5e7eb}.border-t{border-top:1px solid #e5e7eb}.border-t-2{border-top:2px solid #e5e7eb}
          .rounded{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}
          .shadow-sm{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}
          .relative{position:relative}.absolute{position:absolute}.left-0{left:0}.z-10{z-index:10}
          .block{display:block}.hidden{display:none}.overflow-auto{overflow:auto}
          .hover\\:bg-accent:hover{background-color:#f3f4f6}.hover\\:bg-primary:hover{background-color:#2563eb}
          .hover\\:border-primary:hover{border-color:#3b82f6}.hover\\:underline:hover{text-decoration:underline}
          .transition-colors{transition-property:color,background-color,border-color;transition-duration:150ms}
          .cursor-not-allowed{cursor:not-allowed}.opacity-50{opacity:.5}
          button{display:inline-flex;align-items:center;justify-content:center;padding:.5rem 1rem;font-size:.875rem;font-weight:500;border-radius:.375rem;border:1px solid transparent;cursor:pointer;transition:all 150ms;white-space:nowrap;background-color:#3b82f6;color:white}
          button:hover{background-color:#2563eb}button:disabled{opacity:.5;cursor:not-allowed}
          button.outline{background-color:white;border-color:#e5e7eb;color:#1f2937}button.outline:hover{background-color:#f9fafb}
          button.ghost{background-color:transparent;color:#1f2937}button.ghost:hover{background-color:#f3f4f6}
          button.sm{padding:.375rem .75rem;font-size:.875rem}
          input,select,textarea{display:block;width:100%;padding:.5rem .75rem;font-size:.875rem;line-height:1.5;color:#1f2937;background-color:white;border:1px solid #d1d5db;border-radius:.375rem;transition:border-color 150ms}
          input:focus,select:focus,textarea:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}
          label{display:block;font-size:.875rem;font-weight:500;margin-bottom:.25rem;color:#374151}
          table{width:100%;border-collapse:collapse}th,td{padding:.75rem 1rem;text-align:left;border-bottom:1px solid #e5e7eb}
          th{font-weight:500;font-size:.875rem;color:#6b7280;background-color:#f9fafb}tr:hover{background-color:#f9fafb}
          .card{background-color:white;border:1px solid #e5e7eb;border-radius:.5rem;box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}
          .card-header{padding:1.5rem;border-bottom:1px solid #e5e7eb}.card-content{padding:1.5rem}.card-title{font-size:1.5rem;font-weight:600}
          .badge{display:inline-flex;align-items:center;padding:.125rem .5rem;font-size:.75rem;font-weight:600;border-radius:9999px}
          .badge-success{background-color:#22c55e;color:white}.badge-secondary{background-color:#f3f4f6;color:#1f2937}
          nav{background-color:white;border-bottom:1px solid #e5e7eb}.group:hover .group-hover\\:block{display:block}
          @media (min-width:768px){.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
          @media (min-width:1024px){.lg\\:px-8{padding-left:2rem;padding-right:2rem}}
        `}} />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
