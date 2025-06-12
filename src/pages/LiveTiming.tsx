"use client";

import { useEffect, useState } from "react";
import { createClient } from "graphql-ws";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { country2flag } from "@/lib/isoCode2symbol";

// Type definitions for the GraphQL response
type Session = {
  id: string;
  name: string;
  startsAt: string;
  liveStatus: {
    sessionStartTime: string;
    currentFlag: {
      type: string;
    };
    isSessionRunning: boolean;
    stoppedSeconds: number;
    finalDurationSeconds: number;
    hasChequeredFlag: boolean;
  };
  weather: {
    ambientTemperatureEx: {
      celsiusDegrees: number;
    };
    humidityPercent: number;
    trackTemperatureEx: {
      celsiusDegrees: number;
    };
  };
  sectorFlags: {
    sector: number;
    type: string;
  }[];
  participants: Participant[];
};

type Participant = {
  id: string;
  number: string;
  position: number;
  isOut: boolean;
  hasSeenCheckeredFlag: boolean;
  completeLapsCount: number;
  pitStopCount: number;
  bestTopSpeedKMH: number;
  lastLap: {
    timeMilliseconds: number;
    state: string;
  };
  bestLap: {
    timeMilliseconds: number;
    state: string;
  };
  lastCompletedSectors: {
    lapTime: number;
    state: string;
  }[];
  previousParticipantGap: {
    type: string;
    lapDifference: number;
    timeMilliseconds: number;
  };
  driver: {
    firstName: string;
    lastName: string;
    country: {
      isoCode2: string;
    };
  };
  team: {
    name: string;
  };
  category: {
    id: string;
    color: string;
  };
  tires: {
    label: string;
  };
};

export function LiveTiming({ sessionId = "7622" }: { sessionId?: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noLiveEvent, setNoLiveEvent] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const client = createClient({
      url: "wss://live-timing-api.sportall.tv/graphql",
    });

    const subscription = client.subscribe(
      {
        query: `subscription Session($sessionId: ID!, $filters: SessionParticipantsFilters, $realTime: Boolean!) {
            session(sessionId: $sessionId) {
              id
              name
              ...Flag
              ...Chrono
              ...SectorFlags
              ...Weather
              ...Leaderboard
              __typename
            }
          }
          fragment Flag on Session {
            id
            startsAt
            liveStatus {
              sessionStartTime
              currentFlag {
                type
                __typename
              }
              __typename
            }
            __typename
          }
          fragment Chrono on Session {
            id
            startsAt
            duration
            liveStatus {
              currentFlag {
                type
                __typename
              }
              isSessionRunning
              stoppedSeconds
              sessionStartTime
              finalDurationSeconds
              __typename
            }
            __typename
          }
          fragment SectorFlags on Session {
            id
            closed
            liveStatus {
              currentFlag {
                type
                __typename
              }
              __typename
            }
            sectorFlags {
              sector
              type
              __typename
            }
            __typename
          }
          fragment Weather on Session {
            id
            weather {
              ambientTemperatureEx {
                celsiusDegrees
                __typename
              }
              humidityPercent
              trackTemperatureEx {
                celsiusDegrees
                __typename
              }
              __typename
            }
            __typename
          }
          fragment Leaderboard on Session {
            id
            chronoType
            participants(filters: $filters) {
              id
              ...LeaderboardParticipant
              __typename
            }
            __typename
          }
          fragment LeaderboardParticipant on SessionParticipant {
            id
            number
            isOut
            ...PositionCell
            ...NumberCell
            ...TeamCell
            ...PicCell
            ...CarCell @skip(if: $realTime)
            ...TiresCell @skip(if: $realTime)
            ...LapsCell
            ...GapCell
            ...SectorCell
            ...LastLapCell
            ...BestLapCell
            ...MaxSpeedCell
            ...PitsCell
            __typename
          }
          fragment PositionCell on SessionParticipant {
            id
            position
            status
            isOut
            hasSeenCheckeredFlag
            __typename
          }
          fragment NumberCell on SessionParticipant {
            id
            number
            category {
              id
              color
              __typename
            }
            __typename
          }
          fragment TeamCell on SessionParticipant {
            id
            team {
              id
              name
              __typename
            }
            driver {
              firstName
              lastName
              country {
                isoCode2
              }
              __typename
            }
            __typename
          }
          fragment PicCell on SessionParticipant {
            id
            positionInCategory
            category {
              id
              color
              __typename
            }
            __typename
          }
          fragment CarCell on SessionParticipant {
            id
            picture {
              smallUrl
              __typename
            }
            car {
              id
              name
              __typename
            }
            __typename
          }
          fragment TiresCell on SessionParticipant {
            id
            tires {
              label
              __typename
            }
            __typename
          }
          fragment LapsCell on SessionParticipant {
            id
            completeLapsCount
            __typename
          }
          fragment GapCell on SessionParticipant {
            id
            completeLapsCount
            previousParticipantGap {
              type
              lapDifference
              timeMilliseconds
              __typename
            }
            __typename
          }
          fragment SectorCell on SessionParticipant {
            id
            lastCompletedSectors {
              lapTime
              state
              __typename
            }
            __typename
          }
          fragment LastLapCell on SessionParticipant {
            id
            lastLap {
              timeMilliseconds
              state
              __typename
            }
            __typename
          }
          fragment BestLapCell on SessionParticipant {
            id
            bestLap {
              timeMilliseconds
              state
              __typename
            }
            __typename
          }
          fragment MaxSpeedCell on SessionParticipant {
            id
            bestTopSpeedKMH
            __typename
          }
          fragment PitsCell on SessionParticipant {
            id
            pitStopCount
            __typename
          }
        `,
        variables: {
          sessionId,
          filters: {},
          realTime: true,
        },
      },
      {
        next: ({ data }) => {
          setSession(data?.session);
          setLoading(false);
        },
        error: (err) => {
          setError(err.message);
          setLoading(false);
        },
        complete: () => {
          console.log("Subscription complete");
        },
      },
    );

    return () => subscription();
  });

  const formatLapTime = (ms: number) => {
    if (!ms) return "--:--.---";
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor(ms % 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  const getSessionStatus = () => {
    if (!session?.liveStatus) return "Not Started";
    if (session.liveStatus.hasChequeredFlag) return "Finished";
    if (session.liveStatus.isSessionRunning) return "Running";
    return "About to Start";
  };

  const getDriverStatus = (participant: Participant) => {
    if (session?.liveStatus?.hasChequeredFlag) {
      return participant.hasSeenCheckeredFlag ? "Finished" : "DNF";
    }
    return participant.isOut ? "Out" : "Running";
  };
  const [isComing, setIsComing] = useState(false);
  if (isComing) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-center text-4xl text-foreground">
            Coming Soon.
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center ">
          <Icons.alert className="text-foreground" />
          <p className="text-foreground ml-4">Stay tuned for more updates</p>
        </CardContent>
      </Card>
    );
  }

  if (noLiveEvent) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-foreground">
            No live events scheduled currently
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center gap-2">
          <Icons.clock className="text-foreground" />
          <p className="text-foreground">Please check back later</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading session data...</CardTitle>
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
          <CardTitle>Error loading session</CardTitle>
          <CardDescription className="text-destructive">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No session data available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{session?.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {getSessionStatus()}
                </Badge>
                <Badge variant="outline">
                  Flag: {session.liveStatus.currentFlag.type}
                </Badge>
                <Badge variant="outline">
                  {session.weather.ambientTemperatureEx.celsiusDegrees}°C
                </Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {session.participants.length} drivers
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
            Current session standings and lap times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Pos</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="text-foreground">Country</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Laps</TableHead>
                <TableHead className="text-right">Last Lap</TableHead>
                <TableHead className="text-right">Best Lap</TableHead>
                <TableHead className="text-right">Gap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.participants
                .sort((a, b) => a.position - b.position)
                .map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium`}>
                          {participant.driver.firstName}{" "}
                          {participant.driver.lastName}
                        </span>
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0.5 text-xs"
                          style={{ color: `${participant.category.color}` }}
                        >
                          #{participant.number}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {participant.driver?.country?.isoCode2
                        ? country2flag(participant.driver.country?.isoCode2)
                        : participant.driver?.country?.name}
                    </TableCell>
                    <TableCell>{participant.team.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          getDriverStatus(participant) === "Finished"
                            ? "default"
                            : "outline"
                        }
                        className={
                          getDriverStatus(participant) === "DNF"
                            ? "bg-destructive/10 text-destructive-foreground border-destructive"
                            : ""
                        }
                      >
                        {getDriverStatus(participant)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {participant.completeLapsCount}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatLapTime(participant.lastLap?.timeMilliseconds)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-primary">
                      {formatLapTime(participant.bestLap?.timeMilliseconds)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {participant.position === 1
                        ? "-"
                        : participant.previousParticipantGap
                          ? `+${formatLapTime(participant.previousParticipantGap.timeMilliseconds)}`
                          : "-"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
