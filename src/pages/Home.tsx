"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Icons } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { country2flag } from "@/lib/isoCode2symbol";

function Home() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string>("7616");

  const fetchSessionData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://live-timing-api.sportall.tv/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query Session($sessionId: ID!) {
                          session(sessionId: $sessionId) {
                            id
                            name
                            race {
                              name
                            }
                            liveStatus {
                              isClosed
                              isSessionRunning
                              sessionStartTime
                            }
                            participants {
                              number
                              hasSeenCheckeredFlag
                              driver {
                                firstName
                                lastName

                              }
                              team {
                                name
                              }
                              lastLap {
                                timeMilliseconds
                              }
                              bestLap {
                                timeMilliseconds
                              }
                            }
                          }
                        }`,
            variables: { sessionId },
          }),
        },
      );

      const { data } = await response.json();
      console.log(data?.session);
      setSessionData(data.session);
    } catch (error) {
      console.error("Error fetching session data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const formatLapTime = (ms: number) => {
    if (!ms) return "--:--.---";
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor(ms % 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  const getSessionStatus = () => {
    if (!sessionData?.liveStatus) return "Not Started";
    if (sessionData.liveStatus.isClosed) return "Completed"; // Changed from "Finished" to "Completed"
    if (sessionData.liveStatus.isSessionRunning) return "Running";
    if (sessionData.liveStatus.sessionStartTime) return "About to Start";
    return "Not Started";
  };

  // Update the getParticipantStatus function to match
  const getParticipantStatus = (participant: any) => {
    if (sessionData?.liveStatus?.isClosed) {
      // Changed from hasChequeredFlag to isClosed
      return participant.hasSeenCheckeredFlag ? "Completed" : "DNF"; // Changed from "Finished" to "Completed"
    }
    return sessionData?.liveStatus?.isSessionRunning
      ? "Running"
      : "Not Started";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Real-Time Racing Analytics
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Track live timing, driver performance, and team statistics with our
            cutting-edge racing dashboard.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative w-full sm:w-96">
              <Input
                type="text"
                placeholder="Enter Session ID"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="pl-10 pr-4 py-3 bg-foreground/5 text-foreground"
              />
              <Icons.search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>
            <Button onClick={fetchSessionData} disabled={loading || !sessionId}>
              {loading ? "Loading..." : "Track Session"}
            </Button>
          </div>
        </div>
      </section>

      {/* Session Info */}
      {sessionData && (
        <section className="container mx-auto px-4 pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary"
                >
                  {getSessionStatus()}
                </Badge>
                {sessionData.liveStatus?.hasChequeredFlag && (
                  <span className="text-2xl">🏁</span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {sessionData.race.name} -{" "}
                <span className="text-primary">{sessionData.name}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-sm text-muted-foreground">
                  Live Timing
                </span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">
                {sessionData.participants.length} Drivers
              </span>
            </div>
          </div>

          {/* Leaderboard */}
          <Card className="bg-foreground/5">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Current Standings
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {getSessionStatus() === "Finished"
                  ? "Final Results"
                  : "Real-time lap times and performance metrics"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[60px] text-foreground">
                      Pos
                    </TableHead>
                    <TableHead className="text-foreground">Driver</TableHead>
                    <TableHead className="text-foreground">Team</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-right text-foreground">
                      Last Lap
                    </TableHead>
                    <TableHead className="text-right text-foreground">
                      Best Lap
                    </TableHead>
                    <TableHead className="text-right text-foreground">
                      Gap
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionData.participants.map(
                    (participant: any, index: number) => (
                      <TableRow
                        key={index}
                        className="border-border hover:bg-foreground/5"
                      >
                        <TableCell className="text-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="font-medium text-foreground">
                              {participant.driver?.firstName != null
                                ? participant.driver.firstName
                                : "-"}{" "}
                              {participant.driver?.lastName != null
                                ? participant.driver.lastName
                                : "-"}
                            </div>
                            <Badge
                              variant="outline"
                              className="px-2 py-0.5 text-xs text-foreground"
                            >
                              #{participant.number}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell className="text-foreground">
                          {participant.team.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              getParticipantStatus(participant) === "Finished"
                                ? "default"
                                : "outline"
                            }
                            className={
                              getParticipantStatus(participant) === "DNF"
                                ? "bg-destructive text-destructive-foreground border-destructive"
                                : ""
                            }
                          >
                            {getParticipantStatus(participant)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-foreground">
                          {formatLapTime(participant.lastLap?.timeMilliseconds)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-primary">
                          {formatLapTime(participant.bestLap?.timeMilliseconds)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-foreground">
                          {index === 0
                            ? "--"
                            : `+${formatLapTime(participant.bestLap?.timeMilliseconds - sessionData.participants[0].bestLap?.timeMilliseconds)}`}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Features Section */}
      {!sessionData && (
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-foreground/5 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Icons.clock className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-foreground">
                    Real-Time Data
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Get millisecond-precise timing data with our low-latency API
                  connection.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-foreground/5 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Icons.barChart className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-foreground">
                    Advanced Analytics
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Compare sector times, track evolution, and driver performance
                  metrics.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-foreground/5 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Icons.cast className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-foreground">
                    Multi-Platform
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Access from any device - desktop, tablet, or mobile with
                  responsive design.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
