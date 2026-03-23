import * as React from "react"

// 1. Table Container (Handles scrolling)
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto border border-gray-200 rounded-lg">
    <table
      ref={ref}
      className={`w-full caption-bottom text-sm text-left ${className}`}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

// 2. Header Section
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={`bg-gray-50 border-b border-gray-200 ${className}`} {...props} />
))
TableHeader.displayName = "TableHeader"

// 3. Body Section
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={`[&_tr:last-child]:border-0 ${className}`}
    {...props}
  />
))
TableBody.displayName = "TableBody"

// 4. Footer Section
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={`border-t bg-gray-50 font-medium [&>tr]:last:border-b-0 ${className}`}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

// 5. Row
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`
      border-b border-gray-100 transition-colors hover:bg-gray-50/50 
      data-[state=selected]:bg-gray-100 ${className}
    `}
    {...props}
  />
))
TableRow.displayName = "TableRow"

// 6. Header Cell (th)
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`
      h-12 px-4 align-middle font-bold text-[#06392F] uppercase tracking-wider text-xs
      [&:has([role=checkbox])]:pr-0 ${className}
    `}
    {...props}
  />
))
TableHead.displayName = "TableHead"

// 7. Data Cell (td)
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 text-gray-700 ${className}`}
    {...props}
  />
))
TableCell.displayName = "TableCell"

// 8. Caption
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={`mt-4 text-sm text-gray-500 ${className}`}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}