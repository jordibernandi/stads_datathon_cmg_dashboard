"use client"

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFilterStore } from "@/store";

const DateRange = () => {
    const { masterStartDate, masterEndDate, setMasterStartDate, setMasterEndDate } = useFilterStore();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <span className="tracking-wide uppercase text-xs">Start Date</span>
                <div className="flex flex-wrap gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !masterStartDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {masterStartDate ? format(masterStartDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                            <Calendar
                                mode="single"
                                selected={masterStartDate ? new Date(masterStartDate) : undefined}
                                onSelect={(dateString) => {
                                    const formattedDate = dateString ? new Date(dateString).toLocaleDateString('en-US') : "";
                                    setMasterStartDate(formattedDate);
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className="tracking-wide uppercase text-xs">End Date</span>
                <div className="flex flex-wrap gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !masterEndDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {masterEndDate ? format(masterEndDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                            <Calendar
                                mode="single"
                                selected={masterEndDate ? new Date(masterEndDate) : undefined}
                                onSelect={(dateString) => {
                                    const formattedDate = dateString ? new Date(dateString).toLocaleDateString('en-US') : "";
                                    setMasterEndDate(formattedDate);
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}

export default DateRange;