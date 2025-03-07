"use client"

import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DateRange = () => {
    const searchParams = useSearchParams();

    const paramStart = searchParams.get("start") ?? "";
    const paramEnd = searchParams.get("end") ?? "";

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
                                    !paramStart && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {paramStart ? format(paramStart, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                            <Calendar
                                mode="single"
                                selected={new Date(paramStart)}
                                onSelect={(dateString) => {
                                    const formattedDate = dateString ? new Date(dateString).toLocaleDateString('en-US') : "";
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
                                    !paramEnd && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {paramEnd ? format(paramEnd, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                            <Calendar
                                mode="single"
                                selected={new Date(paramEnd)}
                                onSelect={(dateString) => {
                                    const formattedDate = dateString ? new Date(dateString).toLocaleDateString('en-US') : "";
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