"use client";

import { categoryInfo } from "@/lib/api";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CategoryInfo } from "@/types/types";
import DashboardPage from "./Dashbord";
import { DashboardLayout } from "./components/DashboardLayout";
import { EmptyCategoryState } from "./components/EmptyCategoryState";
import { getEventsByCategoryName } from "@/lib/api";
import type { Event, EventCategoryForm, EventsByCategoryName } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { set, startOfMonth, startOfWeek } from "date-fns";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, BarChart } from "lucide-react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Row, SortingState, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/Heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const CategoryEventPage = () => {
  const { getToken } = useAuth();
  const { name } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [events, setEvents] = useState<EventsByCategoryName>(); // <- estado para eventos
  const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(true)
  const [error, setError] = useState(false); // <- adicionamos erro
  const [refreshKey, setRefreshKey] = useState(0); // <- chave de atualização
  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">("today");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })

  useEffect(() => {
    const fetchCategory = async () => {
      if (typeof name !== "string") {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const res = await categoryInfo(token!, name);
        if (res) {
          setCategory(res);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Erro ao buscar categoria", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [getToken, name, refreshKey]);


  useEffect(() => {
    const fetchEvents = async () => {
      if (!category || category._count.events === 0) return;

      const token = await getToken();
      const res: EventsByCategoryName  = await getEventsByCategoryName(token!, name!, activeTab, pagination.pageIndex + 1, pagination.pageSize);
      console.log("Eventos", res);
      setEvents(res)
    };

    fetchEvents();
    setIsLoadingEvent(false)
    },  [category, getToken, name, activeTab, pagination]
  );

  const numericCalculations = useMemo(() => {
    if (!events || events.events.length === 0) return {};
    const sums: Record<string, {
      total: number;
      thisWeek: number;
      thisMonth: number;
      today: number;
    }> = {}
    const now = new Date();
    const weekStart = startOfWeek(now, {weekStartsOn: 0});
    const monthStart = startOfMonth(now);

    events.events.forEach((event) => {
      const eventDate = event.createdAt;
      console.log("Data", typeof eventDate, "\n", eventDate)
      
      Object.entries(event.fields).forEach(([field, value]) => {
        if (typeof value === "number") {
          if (!sums[field]) {
            sums[field] = {
              total: 0,
              thisWeek: 0,
              thisMonth: 0,
              today: 0
            }
          }

          sums[field].total += value;

          if (eventDate >= weekStart) {
            sums[field].thisWeek += value;
          }

          if (eventDate >= monthStart) {
            sums[field].thisMonth += value;
          }
          
          if (eventDate.toDateString() === now.toDateString()) {
            sums[field].today += value;
          }
        }
      })
    })
      return sums;
  }, [events?.events])


  // TABLE DEFS
  const columns: ColumnDef<Event>[] = useMemo(()=> [
    {
      accessorKey:"category",
      header: "Category",
      cell: () => <span>{category?.name || "Uncategorized"}</span>
    },
    {
      accessorKey: "createdAt",
      header: ({column}) => {
        return (
          <Button 
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Date
              <ArrowUpDown className="ml-2 size-4"/>
            </Button>
        )
      },
      cell: ({row}) => {
        return new Date(row.getValue("createdAt")).toLocaleString()
      },
    },
    ...(events?.events[0] ? 
      Object.keys(events.events[0].fields as object).map((field) => ({
        accessorFn: (row: Event) => 
          (row.fields as Record<string, any>)[field],
        header: field,
        cell: ({row}: { row: Row<Event>}) => (
          row.original.fields as Record<string, any>
        )[field] || "-"
      })) : []
    ),
    {
      accessorKey: "deliveryStatus",
      header: "Deliever Status",
      cell: ({row}) => (
        <span 
          className={cn("px-2 py-1 rounded-full text-xs font-semibold", {
            "bg-green-100 text-green-800": row.getValue("deliveryStatus") === "DELIVERED",
            "bg-red-100 text-red-800": row.getValue("deliveryStatus") === "FAILED",
            "bg-yellow-100 text-yellow-800": row.getValue("deliveryStatus") === "PENDING",
          })}
        >
          {row.getValue("deliveryStatus")}
        </span>
      )
    }
  ], [category?.name, events?.events]);

  // TABLE
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  
  const table = useReactTable({
    data: events?.events || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((events?.eventsCount || 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    }

  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader" />
      </div>
    );
  }

  if (error || !category) {
    return <NotFoundPage />;
  }

  const hasEvents = category._count.events > 0;

  const NumericFieldsComponent = () => {
    if (Object.keys(numericCalculations).length === 0) return null;

    return Object.entries(numericCalculations).map(([field, sums]) => {
      const relevantSum = 
        activeTab === "today" ? sums.today :
        activeTab === "week" ? sums.thisWeek :
        activeTab === "month" ? sums.thisMonth : 0;


      return (
        <Card key={field} className="border-2 border-brand-850 rounded-lg hover:border-brand-200">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</p>
            <BarChart className="size-4"/>  
          </div>  

          <div>
            <p className="text-2xl font-bold">{relevantSum.toFixed(0)}</p>
            <p className="text-xm/5 text-muted-foreground text-pretty">
              {
                activeTab === "today" ? "hoje" : activeTab === "week" ? "esta semana" : "este mês"
              }
            </p>
          </div>
        </Card> 
      )
  })

  }

  if (!hasEvents) {
    return (
      <DashboardLayout title={`${category.emoji} ${category.name} events`}>
        <EmptyCategoryState categoryName={category.name} onCreated={() => setRefreshKey(prev => prev + 1)}/>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${category.emoji} ${category.name} events`}>
      <div className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "today" | "week" | "month")
          }}
        >
          <TabsList className="mb-2">
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="week">Esta semana</TabsTrigger>
            <TabsTrigger value="month">Este mês</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              <Card className="border-2 border-brand-850 rounded-lg hover:border-brand-200">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <p className="text-sm/6 font-medium">Total Events</p>
                  <BarChart className="size-4"/>  
                </div>  

                <div>
                  <p className="text-2xl font-bold">{events?.eventsCount || 0}</p>
                  <p className="text-xm/5 text-muted-foreground text-pretty">
                    Eventos{" "} {
                      activeTab === "today" ? "hoje" : activeTab === "week" ? "esta semana" : "este mês"
                    }
                  </p>
                </div>
              </Card>  
              <NumericFieldsComponent />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-full flex flex-col gap-4">
              <Heading>
                Events Overview
              </Heading>
            </div>
          </div>

          <Card constentClassName="px-6 py-4 bg-white rounded-lg">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                         <TableHead id={header.id}>
                          {header.isPlaceholder? null: flexRender(header.column.columnDef.header, header.getContext())}
                         </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {isLoadingEvent ? (
                    [...Array(5)].map((_, rIndex) => (
                      <TableRow key={rIndex}>
                        {columns.map((_, cIndex) => (
                          <TableCell key={cIndex}>
                            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ): table.getRowModel().rows.length ? (
                    table
                      .getRowModel()
                      .rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                  ): (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No Results
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
          </Card>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={()=> table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoadingEvent}
          >
            Previus
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={()=> table.nextPage()}
            disabled={!table.getCanNextPage() || isLoadingEvent}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

function NotFoundPage() {
  const {name} = useParams();

  console.log("NotFoundPage",name, typeof name);
  return (
    
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600">404 - Página não encontrada</h1>
      <p className="mt-4 text-gray-600">Verifique a URL e tente novamente.</p>
    </div>
  );
}