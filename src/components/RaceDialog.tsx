"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LiveTiming } from "@/pages/LiveTiming"; // Your existing LiveTiming component

export function RaceDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [raceId, setRaceId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const handleSubmit = () => {
    setSubmittedId(raceId);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Track Race Session</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Race Session ID</DialogTitle>
            <DialogDescription>
              Please provide the race session ID to track live timing data. You
              can check out the schedule to get the race ID.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="raceId" className="text-right">
                Session ID
              </Label>
              <Input
                id="raceId"
                value={raceId}
                onChange={(e) => setRaceId(e.target.value)}
                placeholder="e.g. 7618"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Track Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {submittedId && <LiveTiming sessionId={submittedId} />}
    </>
  );
}
