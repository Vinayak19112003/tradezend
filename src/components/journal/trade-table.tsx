"use client";

import { useState, memo, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Trade } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MoreHorizontal, ImageIcon, Trash2, Edit, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StreamerModeText } from "@/components/streamer-mode-text";
import { TradeDetailsDialog } from "./trade-details-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { useCurrency } from "@/contexts/currency-context";

type TradeTableProps = {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
};

const ResultBadge = ({ result }: { result: Trade["result"] }) => {
  const styles = {
    Win: "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
    Loss: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
    BE: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20",
    Missed: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"
  };

  return (
    <Badge variant="outline" className={cn("border px-2 py-0.5 uppercase text-[10px] font-bold tracking-wider", styles[result] || styles.BE)}>
      {result}
    </Badge>
  );
};

const ITEMS_PER_PAGE = 10;

export default memo(function TradeTable({
  trades,
  onEdit,
  onDelete,
}: TradeTableProps) {
  const [tradeToDelete, setTradeToDelete] = useState<Trade | null>(null);
  const [viewingTrade, setViewingTrade] = useState<Trade | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const { formatCurrency } = useCurrency();

  const totalPages = Math.ceil(trades.length / ITEMS_PER_PAGE);

  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return trades.slice(startIndex, endIndex);
  }, [trades, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage, endPage;
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxPagesToShow - 1;
        pageNumbers.push(...Array.from({ length: endPage }, (_, i) => i + 1));
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - (maxPagesToShow - 2);
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = startPage; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }

    return (
      <Pagination className="justify-center">
        <PaginationContent className="bg-zinc-950/50 backdrop-blur-sm border border-white/5 rounded-full p-1">
          <PaginationItem>
            <PaginationPrevious className="hover:bg-white/5 hover:text-white transition-colors" href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1) }} />
          </PaginationItem>
          {pageNumbers.map((page, index) =>
            typeof page === 'number' ? (
              <PaginationItem key={index}>
                <PaginationLink className={cn("hover:bg-white/5 hover:text-white transition-colors", currentPage === page && "bg-blue-600 hover:bg-blue-600 text-white")} href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page) }} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={index}>
                <PaginationEllipsis className="text-zinc-500" />
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext className="hover:bg-white/5 hover:text-white transition-colors" href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1) }} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  const handleViewTrade = (trade: Trade) => {
    setViewingTrade(trade);
  };

  const handleConfirmDelete = () => {
    if (tradeToDelete) {
      onDelete(tradeToDelete.id);
      setTradeToDelete(null);
    }
  };

  // Mobile View Content
  const tradeListContent = paginatedTrades.length > 0 ? (
    paginatedTrades.map((trade) => {
      const returnPercentage = trade.accountSize && trade.accountSize > 0 && trade.pnl != null ? (trade.pnl / trade.accountSize) * 100 : 0;
      return (
        <Card key={trade.id} className="w-full bg-zinc-900/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="p-4 border-b border-white/5">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base text-zinc-100">{trade.asset}</CardTitle>
                <CardDescription className="text-zinc-500">{format(trade.date, "PPP")}</CardDescription>
              </div>
              <ResultBadge result={trade.result} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="font-medium text-zinc-500">Direction</div>
            <div className={cn("font-semibold flex items-center", trade.direction === 'Buy' ? 'text-green-500' : 'text-red-500')}>
              {trade.direction === 'Buy' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {trade.direction}
            </div>

            <div className="font-medium text-zinc-500">PNL</div>
            <div>
              <StreamerModeText className={cn("font-mono font-medium", trade.pnl != null && trade.pnl > 0 ? 'text-green-500' : trade.pnl != null && trade.pnl < 0 ? 'text-red-500' : 'text-zinc-400')}>
                {trade.pnl != null ? formatCurrency(trade.pnl, { sign: true }) : 'N/A'}
              </StreamerModeText>
            </div>

            <div className="font-medium text-zinc-500">Return %</div>
            <div>
              <StreamerModeText className={cn("font-mono font-medium", returnPercentage > 0 ? 'text-green-500' : returnPercentage < 0 ? 'text-red-500' : 'text-zinc-400')}>
                {trade.accountSize && trade.accountSize > 0 ? `${returnPercentage.toFixed(2)}%` : 'N/A'}
              </StreamerModeText>
            </div>

            {/* ... other mobile fields ... */}

            <div className="col-span-2 mt-4 flex justify-between items-center border-t border-white/5 pt-4">
              <Button variant="ghost" size="sm" onClick={() => handleViewTrade(trade)} className="text-zinc-400 hover:text-white">
                View Details
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-zinc-200">
                  <DropdownMenuItem onSelect={() => onEdit(trade)} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setTradeToDelete(trade)} className="text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      )
    })
  ) : (
    <div className="h-24 text-center flex items-center justify-center text-zinc-500 col-span-full">
      No trades to display.
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full space-y-4">
        <div className="space-y-4">{tradeListContent}</div>
        {totalPages > 1 && <div className="py-4">{renderPagination()}</div>}
        {/* ... Alerts/Dialogs ... */}
        <AlertDialog open={!!tradeToDelete} onOpenChange={(open) => !open && setTradeToDelete(null)}>
          <AlertDialogContent className="bg-zinc-900 border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Trade?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 text-white">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <TradeDetailsDialog
          isOpen={!!viewingTrade}
          onOpenChange={(open) => !open && setViewingTrade(null)}
          trade={viewingTrade}
        />
      </div>
    )
  }

  // Desktop View
  return (
    <div className="w-full space-y-4">
      <div className="rounded-xl border border-white/5 overflow-hidden bg-zinc-900/40 backdrop-blur-xl shadow-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-medium">Date</TableHead>
              <TableHead className="text-zinc-400 font-medium">Asset</TableHead>
              <TableHead className="text-zinc-400 font-medium">Strategy</TableHead>
              <TableHead className="text-zinc-400 font-medium">Direction</TableHead>
              <TableHead className="text-center text-zinc-400 font-medium">RR</TableHead>
              <TableHead className="text-right text-zinc-400 font-medium">PNL</TableHead>
              <TableHead className="text-right text-zinc-400 font-medium">Return %</TableHead>
              <TableHead className="text-center text-zinc-400 font-medium">Conf.</TableHead>
              <TableHead className="text-zinc-400 font-medium">Result</TableHead>
              <TableHead className="text-zinc-400 font-medium">Mistakes</TableHead>
              <TableHead className="text-center text-zinc-400 font-medium">Media</TableHead>
              <TableHead className="text-right text-zinc-400 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTrades.length > 0 ? (
              paginatedTrades.map((trade) => {
                const returnPercentage = trade.accountSize && trade.accountSize > 0 && trade.pnl != null ? (trade.pnl / trade.accountSize) * 100 : 0;

                return (
                  <TableRow key={trade.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="font-medium text-zinc-300 font-mono text-xs">{format(trade.date, "dd MMM")}</TableCell>
                    <TableCell className="font-semibold text-white">{trade.asset}</TableCell>
                    <TableCell className="text-zinc-400 text-sm">{trade.strategy}</TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center font-medium", trade.direction === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                        {trade.direction === 'Buy' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {trade.direction}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-mono text-zinc-300">{trade.rr?.toFixed(2) ?? '-'}</TableCell>
                    <TableCell>
                      <StreamerModeText className={cn("text-right block font-mono font-medium", trade.pnl != null && trade.pnl > 0 ? 'text-green-500' : trade.pnl != null && trade.pnl < 0 ? 'text-red-500' : 'text-zinc-500')}>
                        {trade.pnl != null ? formatCurrency(trade.pnl) : '-'}
                      </StreamerModeText>
                    </TableCell>
                    <TableCell>
                      <StreamerModeText className={cn("text-right block font-mono font-medium", returnPercentage > 0 ? 'text-green-500' : returnPercentage < 0 ? 'text-red-500' : 'text-zinc-500')}>
                        {trade.accountSize && trade.accountSize > 0 ? `${returnPercentage.toFixed(2)}%` : '-'}
                      </StreamerModeText>
                    </TableCell>
                    <TableCell className="text-center text-zinc-400 text-xs">{trade.confidence}/10</TableCell>
                    <TableCell><ResultBadge result={trade.result} /></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {trade.mistakes?.slice(0, 2).map(mistake => (
                          <span key={mistake} className="text-[10px] text-zinc-500 bg-zinc-800/50 border border-white/5 px-1.5 py-0.5 rounded-sm line-clamp-1">
                            {mistake}
                          </span>
                        ))}
                        {trade.mistakes && trade.mistakes.length > 2 && (
                          <span className="text-[10px] text-zinc-600 px-1">+ {trade.mistakes.length - 2}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {trade.screenshotURL ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10">
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl bg-zinc-950 border-white/10">
                            {/* ... existing image logic ... */}
                            <div className="relative h-[80vh]">
                              <Image
                                src={trade.screenshotURL}
                                alt="Screenshot"
                                fill
                                className="object-contain"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : <span className="text-zinc-800 text-xs">-</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-zinc-200">
                          <DropdownMenuItem onSelect={() => handleViewTrade(trade)} className="hover:bg-white/5 cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onEdit(trade)} className="hover:bg-white/5 cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setTradeToDelete(trade)} className="text-red-500 hover:bg-red-500/10 cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center text-zinc-500">
                  No trades to display.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && <div className="py-8">{renderPagination()}</div>}

      <TradeDetailsDialog
        isOpen={!!viewingTrade}
        onOpenChange={(open) => {
          if (!open) {
            setViewingTrade(null);
          }
        }}
        trade={viewingTrade}
      />

      <AlertDialog open={!!tradeToDelete} onOpenChange={(open) => !open && setTradeToDelete(null)}>
        <AlertDialogContent className="bg-zinc-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trade?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action cannot be undone. This will permanently delete this trade from your log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});
