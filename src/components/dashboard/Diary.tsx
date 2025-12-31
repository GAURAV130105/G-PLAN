import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookImage, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface DiaryEntry {
  id: string;
  date: string;
  note: string;
  photo?: string;
  video?: string;
}

export function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [passcode, setPasscode] = useState<string | null>(localStorage.getItem('diaryPasscode'));
  const [isLocked, setIsLocked] = useState(true);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isSettingPasscode, setIsSettingPasscode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!passcode) {
      setIsSettingPasscode(true);
    }
  }, [passcode]);

  const handleAddEntry = () => {
    const newEntry: DiaryEntry = {
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      note,
      photo: photo ? URL.createObjectURL(photo) : undefined,
      video: video ? URL.createObjectURL(video) : undefined,
    };

    setEntries([newEntry, ...entries]);
    setDialogOpen(false);
    setNote('');
    setPhoto(null);
    setVideo(null);
  };

  const handlePasscodeSubmit = () => {
    if (isSettingPasscode) {
      if (passcodeInput.length === 4) {
        localStorage.setItem('diaryPasscode', passcodeInput);
        setPasscode(passcodeInput);
        setIsSettingPasscode(false);
        setIsLocked(false);
        setPasscodeInput('');
        toast({ title: "Passcode Set!", description: "Your diary is now protected." });
      } else {
        toast({ title: "Invalid Passcode", description: "Passcode must be 4 digits.", variant: "destructive" });
      }
    } else {
      if (passcodeInput === passcode) {
        setIsLocked(false);
        setPasscodeInput('');
      } else {
        toast({ title: "Incorrect Passcode", variant: "destructive" });
      }
    }
  };

  if (isLocked && !isSettingPasscode) {
    return (
      <Card className="animate-slide-up border-border/50 overflow-hidden card-hover" style={{ animationDelay: '600ms' }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2"><Lock className="h-5 w-5 text-accent" /> Diary Locked</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4">Enter your 4-digit passcode to unlock.</p>
            <Input 
                type="password" 
                maxLength={4} 
                className="w-24 text-center text-lg tracking-widest" 
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
            />
            <Button onClick={handlePasscodeSubmit} className="mt-4">Unlock</Button>
        </CardContent>
      </Card>
    );
  }

  if (isSettingPasscode) {
    return (
        <Card className="animate-slide-up border-border/50 overflow-hidden card-hover" style={{ animationDelay: '600ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2"><Lock className="h-5 w-5 text-accent" /> Set Diary Passcode</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4">Create a 4-digit passcode for your diary.</p>
              <Input 
                  type="password" 
                  maxLength={4} 
                  className="w-24 text-center text-lg tracking-widest"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
              />
              <Button onClick={handlePasscodeSubmit} className="mt-4">Set Passcode</Button>
          </CardContent>
        </Card>
      );
  }

  return (
    <Card className="animate-slide-up border-border/50 overflow-hidden card-hover" style={{ animationDelay: '600ms' }}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookImage className="h-5 w-5 text-accent" />
            My Diary
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Entry
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Diary Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <Textarea 
                        placeholder="Write your thoughts for the day..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={5}
                    />
                    <div>
                        <label className="text-sm font-medium mb-2 block">Add a Photo</label>
                        <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Add a Video</label>
                        <Input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)} />
                    </div>
                    <Button onClick={handleAddEntry} className="w-full">Save Entry</Button>
                </div>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>No diary entries yet.</p>
            <p className="text-sm">Click "New Entry" to add one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map(entry => (
              <div key={entry.id} className="border rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground">{entry.date}</p>
                <p>{entry.note}</p>
                {entry.photo && <img src={entry.photo} alt="Diary photo" className="rounded-md" />} 
                {entry.video && <video src={entry.video} controls className="rounded-md" />} 
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}