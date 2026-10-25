"use client";

import {
  Button,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui";
import { useIsMobile } from "@acme/ui/hooks";
import { Badge } from "@acme/ui/reui/badge";
import {
  DataGrid,
  type DataGridFeatures,
  dataGridFeatures,
} from "@acme/ui/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@acme/ui/reui/data-grid/data-grid-column-header";
import { DataGridColumnVisibility } from "@acme/ui/reui/data-grid/data-grid-column-visibility";
import type { DataGridI18nOverrides } from "@acme/ui/reui/data-grid/data-grid-i18n";
import { DataGridPagination } from "@acme/ui/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@acme/ui/reui/data-grid/data-grid-scroll-area";
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@acme/ui/reui/data-grid/data-grid-table";
import {
  DataGridTableDndRowHandle,
  DataGridTableDndRows,
} from "@acme/ui/reui/data-grid/data-grid-table-dnd-rows";
import { Frame, FrameFooter, FramePanel } from "@acme/ui/reui/frame";
import {
  type DataTableItemData,
  dataTableItemSchema,
  type LimitFormData,
  limitFormSchema,
  type TargetFormData,
  targetFormSchema,
} from "@acme/validators";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  type ColumnDef,
  type ColumnVisibilityState,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import type { z } from "zod";

// Use schema from @acme/validators
export const schema = dataTableItemSchema;
type DataTableItem = z.infer<typeof schema>;

const dataGridI18n: DataGridI18nOverrides = {
  labels: {
    sortAscending: "По возрастанию",
    sortDescending: "По убыванию",
    pinColumnStart: "Закрепить слева",
    pinColumnEnd: "Закрепить справа",
    moveColumnStart: "Сдвинуть влево",
    moveColumnEnd: "Сдвинуть вправо",
    columnsMenu: "Столбцы",
    unpinColumn: (title) => `Открепить столбец «${title}»`,
    toggleColumns: "Показать или скрыть столбцы",
    rowCreate: "Добавить строку",
    pinRow: "Закрепить строку",
    unpinRow: "Открепить строку",
    selectRow: "Выбрать строку",
    selectAll: "Выбрать все",
    expandRow: "Развернуть строку",
    collapseRow: "Свернуть строку",
    dragToReorder: "Перетащите, чтобы изменить порядок",
    dragToReorderRow: "Перетащите строку, чтобы изменить порядок",
    reorderingUnavailable: "Изменение порядка недоступно",
    loading: "Загрузка…",
    empty: "Нет данных",
    allRowsLoaded: "Все записи загружены",
    rowsPerPage: "Строк на странице",
    paginationInfo: ({ from, to, count }) => `${from} - ${to} из ${count}`,
    previousPage: "Предыдущая страница",
    nextPage: "Следующая страница",
    goToPage: (page) => `Перейти на страницу ${page}`,
    filterSelectedCount: (count) => `Выбрано: ${count}`,
    filterNoResults: "Ничего не найдено.",
    filterClear: "Сбросить фильтры",
  },
};

// Inline edit component for Target field
function TargetCell({ row }: { row: Row<DataGridFeatures, DataTableItem> }) {
  const form = useForm<TargetFormData>({
    resolver: zodResolver(targetFormSchema),
    defaultValues: {
      target: row.original.target,
    },
  });

  const onSubmit = async (_data: TargetFormData) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: `Сохранение: ${row.original.header}`,
      success: "Готово",
      error: "Ошибка",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor={`${row.original.id}-target`}
                className="sr-only"
              >
                Цель
              </FormLabel>
              <FormControl>
                <Input
                  className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 ms-auto h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
                  id={`${row.original.id}-target`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

// Inline edit component for Limit field
function LimitCell({ row }: { row: Row<DataGridFeatures, DataTableItem> }) {
  const form = useForm<LimitFormData>({
    resolver: zodResolver(limitFormSchema),
    defaultValues: {
      limit: row.original.limit,
    },
  });

  const onSubmit = async (_data: LimitFormData) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: `Сохранение: ${row.original.header}`,
      success: "Готово",
      error: "Ошибка",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor={`${row.original.id}-limit`}
                className="sr-only"
              >
                Лимит
              </FormLabel>
              <FormControl>
                <Input
                  className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 ms-auto h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
                  id={`${row.original.id}-limit`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

// Manual order and a column sort can't both win: `isSorted` mutes the grip
// while the rows are sorted instead of letting a drop silently do nothing.
const getColumns = (
  isSorted: boolean,
): ColumnDef<DataGridFeatures, DataTableItem>[] => [
  {
    id: "drag",
    cell: () => <DataGridTableDndRowHandle disabled={isSorted} />,
    size: 36,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "select",
    header: () => <DataGridTableRowSelectAll />,
    cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    size: 40,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    id: "header",
    header: ({ column }) => (
      <DataGridColumnHeader title="Заголовок" column={column} />
    ),
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    size: 260,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    id: "type",
    header: ({ column }) => (
      <DataGridColumnHeader title="Тип раздела" column={column} />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
    size: 170,
  },
  {
    accessorKey: "status",
    id: "status",
    header: ({ column }) => (
      <DataGridColumnHeader title="Статус" column={column} />
    ),
    cell: ({ row }) =>
      row.original.status === "Готово" ? (
        <Badge variant="success-light">
          <IconCircleCheckFilled />
          {row.original.status}
        </Badge>
      ) : (
        <Badge variant="info-light">
          <IconLoader />
          {row.original.status}
        </Badge>
      ),
    size: 130,
  },
  {
    accessorKey: "target",
    id: "target",
    header: "Цель",
    cell: ({ row }) => <TargetCell row={row} />,
    size: 100,
    enableSorting: false,
    meta: { headerClassName: "text-end", cellClassName: "text-end" },
  },
  {
    accessorKey: "limit",
    id: "limit",
    header: "Лимит",
    cell: ({ row }) => <LimitCell row={row} />,
    size: 100,
    enableSorting: false,
    meta: { headerClassName: "text-end", cellClassName: "text-end" },
  },
  {
    accessorKey: "reviewer",
    id: "reviewer",
    header: ({ column }) => (
      <DataGridColumnHeader title="Проверяющий" column={column} />
    ),
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Назначить проверяющего";

      if (isAssigned) {
        return row.original.reviewer;
      }

      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
            Проверяющий
          </Label>
          <Select>
            <SelectTrigger
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              id={`${row.original.id}-reviewer`}
            >
              <SelectValue placeholder="Назначить проверяющего" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
              <SelectItem value="Jamik Tashpulatov">
                Jamik Tashpulatov
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      );
    },
    size: 190,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
            >
              <IconDotsVertical />
              <span className="sr-only">Открыть меню</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem>Изменить</DropdownMenuItem>
          <DropdownMenuItem>Создать копию</DropdownMenuItem>
          <DropdownMenuItem>В избранное</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Удалить</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 56,
    enableSorting: false,
    enableHiding: false,
  },
];

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const isSorted = sorting.length > 0;
  const columns = React.useMemo(() => getColumns(isSorted), [isSorted]);

  const table = useTable({
    features: dataGridFeatures,
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  // The sortable ids must match the rendered (current page) rows, in order.
  const dataIds = table.getRowModel().rows.map((row) => row.id);

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    setData((current) => {
      const from = current.findIndex((item) => `${item.id}` === active.id);
      const to = current.findIndex((item) => `${item.id}` === over.id);
      return from === -1 || to === -1 ? current : arrayMove(current, from, to);
    });
  }

  return (
    <DataGrid
      table={table}
      recordCount={data.length}
      emptyMessage="Нет результатов."
      i18n={dataGridI18n}
      tableLayout={{ rowsDraggable: true, columnsVisibility: true }}
    >
      <Tabs
        defaultValue="outline"
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Label htmlFor="view-selector" className="sr-only">
            Вид
          </Label>
          <Select defaultValue="outline">
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Выберите вид" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">Структура</SelectItem>
              <SelectItem value="past-performance">
                Прошлые результаты
              </SelectItem>
              <SelectItem value="key-personnel">Ключевой персонал</SelectItem>
              <SelectItem value="focus-documents">
                Основные документы
              </SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="hidden @4xl/main:flex">
            <TabsTrigger value="outline">Структура</TabsTrigger>
            <TabsTrigger value="past-performance">
              Прошлые результаты{" "}
              <Badge variant="secondary" size="sm" radius="full">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="key-personnel">
              Ключевой персонал{" "}
              <Badge variant="secondary" size="sm" radius="full">
                2
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="focus-documents">
              Основные документы
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <DataGridColumnVisibility
              table={table}
              trigger={
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Настроить столбцы</span>
                  <span className="lg:hidden">Столбцы</span>
                </Button>
              }
            />
            <Button variant="outline" size="sm">
              <IconPlus />
              <span className="hidden lg:inline">Добавить раздел</span>
            </Button>
          </div>
        </div>
        <TabsContent value="outline" className="flex flex-col px-4 lg:px-6">
          <Frame className="w-full" stacked dense>
            <FramePanel className="p-0 shadow-none">
              <DataGridScrollArea>
                <DataGridTableDndRows
                  dataIds={dataIds}
                  handleDragEnd={handleDragEnd}
                />
              </DataGridScrollArea>
            </FramePanel>
            <FrameFooter className="flex-row flex-wrap items-center justify-between gap-2 py-1.5 pr-2 pl-2.5">
              <div className="text-muted-foreground hidden text-sm tabular-nums lg:block">
                Выбрано строк: {table.getFilteredSelectedRowModel().rows.length}{" "}
                из {table.getFilteredRowModel().rows.length}.
              </div>
              <DataGridPagination className="lg:w-auto" />
            </FrameFooter>
          </Frame>
        </TabsContent>
        <TabsContent
          value="past-performance"
          className="flex flex-col px-4 lg:px-6"
        >
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
        <TabsContent
          value="key-personnel"
          className="flex flex-col px-4 lg:px-6"
        >
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
        <TabsContent
          value="focus-documents"
          className="flex flex-col px-4 lg:px-6"
        >
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
      </Tabs>
    </DataGrid>
  );
}

const chartData = [
  { month: "Январь", desktop: 186, mobile: 80 },
  { month: "Февраль", desktop: 305, mobile: 200 },
  { month: "Март", desktop: 237, mobile: 120 },
  { month: "Апрель", desktop: 73, mobile: 190 },
  { month: "Май", desktop: 209, mobile: 130 },
  { month: "Июнь", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Компьютер",
    color: "var(--primary)",
  },
  mobile: {
    label: "Телефон",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();

  const form = useForm<DataTableItemData>({
    resolver: zodResolver(dataTableItemSchema),
    defaultValues: {
      id: item.id,
      header: item.header,
      type: item.type,
      status: item.status,
      target: item.target,
      limit: item.limit,
      reviewer: item.reviewer,
    },
  });

  const onSubmit = async (_data: DataTableItemData) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: "Сохранение изменений…",
      success: "Изменения сохранены!",
      error: "Не удалось сохранить изменения",
    });
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit max-w-full px-0 text-left"
          title={item.header}
        >
          <span className="truncate">{item.header}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Общее число посетителей за последние 6 месяцев
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="header"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="header">Заголовок</FormLabel>
                    <FormControl>
                      <Input id="header" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="type">Тип</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="type" className="w-full">
                            <SelectValue placeholder="Выберите тип" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Титульная страница">
                            Титульная страница
                          </SelectItem>
                          <SelectItem value="Оглавление">Оглавление</SelectItem>
                          <SelectItem value="Описание">Описание</SelectItem>
                          <SelectItem value="Технический раздел">
                            Технический раздел
                          </SelectItem>
                          <SelectItem value="Простой язык">
                            Простой язык
                          </SelectItem>
                          <SelectItem value="Юридический раздел">
                            Юридический раздел
                          </SelectItem>
                          <SelectItem value="Визуальный раздел">
                            Визуальный раздел
                          </SelectItem>
                          <SelectItem value="Финансовый раздел">
                            Финансовый раздел
                          </SelectItem>
                          <SelectItem value="Исследование">
                            Исследование
                          </SelectItem>
                          <SelectItem value="Планирование">
                            Планирование
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="status">Статус</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="status" className="w-full">
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Готово">Готово</SelectItem>
                          <SelectItem value="В процессе">В процессе</SelectItem>
                          <SelectItem value="Не начато">Не начато</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="target">Цель</FormLabel>
                      <FormControl>
                        <Input id="target" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="limit">Лимит</FormLabel>
                      <FormControl>
                        <Input id="limit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="reviewer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="reviewer">Проверяющий</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger id="reviewer" className="w-full">
                          <SelectValue placeholder="Выберите проверяющего" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                        <SelectItem value="Jamik Tashpulatov">
                          Jamik Tashpulatov
                        </SelectItem>
                        <SelectItem value="Emily Whalen">
                          Emily Whalen
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <Button onClick={form.handleSubmit(onSubmit)}>Отправить</Button>
          <DrawerClose asChild>
            <Button variant="outline">Готово</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
