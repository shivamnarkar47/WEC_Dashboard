"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icon";
import { format } from "date-fns";

type Race = {
  id: string;
  name: string;
  sessions: {
    id: string;
    name: string;
    startsAt: string;
  }[];
};

export function Schedule({ championshipId }: { championshipId: string }) {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://live-timing-api.sportall.tv/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query FindRaceByName($championshipId: ID!) {
              races(championshipId: $championshipId) {
                id
                name
                sessions {
                  id
                  name
                  startsAt
                }
              }
            }
          `,
            variables: { championshipId: "1" },
          }),
        },
      );

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      setRaces(data?.races || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [championshipId]);

  const getSessionStatus = (startsAt: string) => {
    const now = new Date();
    const sessionTime = new Date(startsAt);

    if (sessionTime > now) return "Upcoming";
    if (sessionTime.getTime() > now.getTime() - 3600000) return "Live Soon";
    return "Completed";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Schedule...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <button
            onClick={fetchSchedule}
            className="mt-4 text-sm text-primary underline"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  if (races.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Races Scheduled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No races found for this championship.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Championship Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {races.map((race) => (
            <div key={race.id} className="border rounded-lg">
              <div className="p-4 bg-muted/50">
                <h3 className="font-semibold text-lg">{race.name}</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead className="w-[200px]">Session</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {race.sessions.map((session) => (
                    <TableRow key={session.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {session.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {session.name}
                      </TableCell>
                      <TableCell>
                        {format(new Date(session.startsAt), "PPPp")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            getSessionStatus(session.startsAt) === "Upcoming"
                              ? "outline"
                              : getSessionStatus(session.startsAt) ===
                                  "Live Soon"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {getSessionStatus(session.startsAt)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
