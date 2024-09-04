"use client"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";


const getPlayers = async () => {
    try {
        const response = await fetch("/api/users", { method: "GET" });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Ensure data is an array
        if (Array.isArray(data)) {
            return data;
        } else {
            console.error('Unexpected data format:', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching players:', error);
        return [];
    }
};
interface Player {
    id: number;
    name: string;
    avatar: string;
    robux: number;
    won: number;
    lost: number;
    messages: number;
    level: number;
    xp: number;
    totalWagered: number;
}


type SortOrder = "asc" | "desc";

export default function Component() {
    const [sortBy, setSortBy] = useState<keyof Player>("robux");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 10;
    const router = useRouter();

    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            setLoading(true);  // Set loading to true when starting to fetch data
            try {
                const allPlayers = await getPlayers();
                setPlayers(allPlayers);
            } catch (error) {
                console.error("Failed to fetch players:", error);
            } finally {
                setLoading(false); // Set loading to false once the data is fetched (or if there was an error)
            }
        };
        fetchPlayers();
    }, []);
    

    const handleNextPage = () => {
        if (currentPage < Math.ceil(sortedPlayers.length / playersPerPage)) {
            setLoading(true);
            setCurrentPage(prevPage => prevPage + 1);
            setTimeout(() => {
                setLoading(false);
            }, 200);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setLoading(true);
            setCurrentPage(prevPage => prevPage - 1);
            setTimeout(() => {
                setLoading(false);
            }, 100);
        }
    };

    const sortedPlayers = useMemo(() => {
        setCurrentPage(1);
        setLoading(true);
    
        let sortedPlayers = Array.isArray(players) ? [...players] : [];
    
        // Sort players based on the selected criteria
        sortedPlayers.sort((playerA, playerB) => {
            const playerAValue = playerA[sortBy];
            const playerBValue = playerB[sortBy];
    
            if (playerAValue < playerBValue) {
                return sortOrder === "asc" ? -1 : 1;
            }
    
            if (playerAValue > playerBValue) {
                return sortOrder === "asc" ? 1 : -1;
            }
    
            return 0;
        });
    
        // Filter players based on the search term
        if (searchTerm) {
            sortedPlayers = sortedPlayers.filter(player =>
                player?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    
        setLoading(false);
        return sortedPlayers;
    }, [players, sortBy, sortOrder, searchTerm]);

    const indexOfLastPlayer = currentPage * playersPerPage;
    const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
    const currentPlayers = sortedPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);


    const renderSkeletonLoader = () => (
        <TableBody>
            {Array.from({ length: playersPerPage }).map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 dark:bg-gray-900 bg-gray-200 rounded-full"></div>
                            <div className="w-32 h-6 dark:bg-gray-900 bg-gray-200 rounded"></div>
                        </div>
                    </TableCell>
                    <TableCell className="text-right bg-gray-200 dark:bg-gray-700 opacity-10 rounded"></TableCell>
                    <TableCell className="text-right bg-gray-200 dark:bg-gray-700 opacity-10 rounded"></TableCell>
                    <TableCell className="text-right bg-gray-200 dark:bg-gray-700 opacity-10 rounded"></TableCell>
                    <TableCell className="text-right bg-gray-200 dark:bg-gray-700 opacity-10 rounded"></TableCell>
                </TableRow>
            ))}
        </TableBody>
    );

    return (
        <div className="bg-background rounded-lg border p-4 md:p-6 w-full overflow-scroll h-full">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6">
                <h2 className="text-2xl font-bold">Leaderboard</h2>
                <div className="flex items-center gap-2 mt-4 md:mt-0 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-1 rounded-xl px-3 h-10 data-[state=open]:bg-muted text-lg">
                                <span className="text-sm">Sort</span>
                                <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="cursor-pointer gap-2 p-2 rounded-lg flex flex-col dark:bg-gray-900">
                            <DropdownMenuItem
                                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted dark:hover:bg-gray-800"
                                onClick={() => {
                                    setSortBy("robux")
                                    setSortOrder("desc")
                                }}
                            >
                                <span className="text-sm">Sort by Robux</span>
                                <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                            </DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem
                                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted dark:hover:bg-gray-800"
                                onClick={() => {
                                    setSortBy("won")
                                    setSortOrder("desc")
                                }}
                            >
                                <span className="text-sm">Sort by Robux Won</span>
                                <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                            </DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem
                                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted dark:hover:bg-gray-800"
                                onClick={() => {
                                    setSortBy("level")
                                    setSortOrder("desc")
                                }}
                            >
                                <span className="text-sm">Sort by Level</span>
                                <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                            </DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem
                                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted dark:hover:bg-gray-800"
                                onClick={() => {
                                    setSortBy("xp")
                                    setSortOrder("desc")
                                }}
                            >
                                <span className="text-sm">Sort by XP</span>
                                <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                            </DropdownMenuItem>
                            <Separator className="my-1" />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="relative w-full md:w-[200px]">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="search"
                            placeholder="Search players..."
                            className="pl-8 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">Robux</TableHead>
                        <TableHead className="text-right">Profit Gambling</TableHead>
                        <TableHead className="text-right">Level</TableHead>
                        <TableHead className="text-right">XP</TableHead>
                    </TableRow>
                </TableHeader>
                {loading ? renderSkeletonLoader() : (
                    <TableBody>
                        {currentPlayers.map((player) => (
                            <TableRow key={player.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="cursor-pointer" onClick={() => router.push(`/profile?id=${player.id}`)}>
                                            <AvatarImage src={player.avatar} className="w-12 h-12 rounded-full" alt="Avatar" />
                                            <AvatarFallback>
                                                {player.name}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{player.name}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{player.robux}</TableCell>
                                <TableCell className="text-right">{player.won}</TableCell>
                                <TableCell className="text-right">{player.level || 0}</TableCell>
                                <TableCell className="text-right">{player.xp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
            <div className="flex flex-col md:flex-row items-center justify-between md:mt-6 mt-auto">
                <div className="text-sm text-muted-foreground">
                    Showing {currentPlayers.length} of {sortedPlayers.length} players (Page {currentPage} of {Math.ceil(sortedPlayers.length / playersPerPage)})
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <ChevronLeftIcon className="w-5 h-5 cursor-pointer" />

                </Button>
            <Button
                className="cursor-pointer p-4"
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage >= Math.ceil(sortedPlayers.length / playersPerPage)}
            >
                <ChevronRightIcon className="w-5 h-5 cursor-pointer" />
            </Button>
                </div>
            </div>
        </div>
    );
}