import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookImage, Lock, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DiaryEntry {
  id: string;
  date: string;
  note: string | null;
  photo_url: string | null;
  video_url: string | null;
}

export function Diary() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<DiaryEntry | null>(null);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [passcode, setPasscode] = useState<string | null>(localStorage.getItem('diaryPasscode'));
  const [isLocked, setIsLocked] = useState(true);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isSettingPasscode, setIsSettingPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchEntries = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('diary')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      toast({ title: "Error fetching entries", description: error.message, variant: "destructive" });
    } else {
      setEntries(data as DiaryEntry[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!passcode) {
      setIsSettingPasscode(true);
    }
    if (user && !isLocked) {
      fetchEntries();
    }
  }, [passcode, user, isLocked]);

  const handleAddEntry = async () => {
    if (!user || (!note && !photo && !video)) {
      toast({ title: "Cannot save empty entry", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    let photoUrl: string | null = null;
    let videoUrl: string | null = null;

    if (photo) {
      const filePath = `${user.id}/${Date.now()}_${photo.name}`;
      const { data, error } = await supabase.storage.from('diary_media').upload(filePath, photo);
      if (error) {
        toast({ title: "Error uploading photo", description: error.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('diary_media').getPublicUrl(data.path);
      photoUrl = publicUrl;
    }

    if (video) {
      const filePath = `${user.id}/${Date.now()}_${video.name}`;
      const { data, error } = await supabase.storage.from('diary_media').upload(filePath, video);
      if (error) {
        toast({ title: "Error uploading video", description: error.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('diary_media').getPublicUrl(data.path);
      videoUrl = publicUrl;
    }

    const { error: insertError } = await supabase.from('diary').insert({
      user_id: user.id,
      date: new Date().toISOString(),
      note: note || null,
      photo_url: photoUrl,
      video_url: videoUrl,
    });

    setIsLoading(false);

    if (insertError) {
      toast({ title: "Error saving entry", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "Entry Saved!", description: "Your diary has been updated." });
      setDialogOpen(false);
      setNote('');
      setPhoto(null);
      setVideo(null);
      fetchEntries();
    }
  };

  const confirmDeleteEntry = (entry: DiaryEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEntry = async () => {
    if (!entryToDelete || !user) return;
    
    setIsLoading(true);
    const filesToDelete: string[] = [];
    if (entryToDelete.photo_url) {
        const photoPath = entryToDelete.photo_url.split('/diary_media/')[1];
        if(photoPath) filesToDelete.push(photoPath);
    }
    if (entryToDelete.video_url) {
        const videoPath = entryToDelete.video_url.split('/diary_media/')[1];
        if(videoPath) filesToDelete.push(videoPath);
    }
    if (filesToDelete.length > 0) {
        await supabase.storage.from('diary_media').remove(filesToDelete);
    }

    const { error } = await supabase.from('diary').delete().eq('id', entryToDelete.id);
      
    setIsLoading(false);

    if (error) {
      toast({ title: "Error deleting entry", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Entry Deleted" });
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
      fetchEntries();
    }
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
        <CardHeader><CardTitle className="text-lg font-semibold flex items-center gap-2"><Lock className="h-5 w-5 text-accent" /> Diary Locked</CardTitle></CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4">Enter your 4-digit passcode to unlock.</p>
            <Input type="password" maxLength={4} className="w-24 text-center text-lg tracking-widest" value={passcodeInput} onChange={(e) => setPasscodeInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePasscodeSubmit()} />
            <Button onClick={handlePasscodeSubmit} className="mt-4">Unlock</Button>
        </CardContent>
      </Card>
    );
  }

  if (isSettingPasscode) {
    return (
        <Card className="animate-slide-up border-border/50 overflow-hidden card-hover" style={{ animationDelay: '600ms' }}>
          <CardHeader><CardTitle className="text-lg font-semibold flex items-center gap-2"><Lock className="h-5 w-5 text-accent" /> Set Diary Passcode</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4">Create a 4-digit passcode for your diary.</p>
              <Input type="password" maxLength={4} className="w-24 text-center text-lg tracking-widest" value={passcodeInput} onChange={(e) => setPasscodeInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePasscodeSubmit()} />
              <Button onClick={handlePasscodeSubmit} className="mt-4">Set Passcode</Button>
          </CardContent>
        </Card>
      );
  }

  return (
    <Card className="animate-slide-up border-border/50 overflow-hidden card-hover" style={{ animationDelay: '600ms' }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2"><BookImage className="h-5 w-5 text-accent" />My Diary</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm" disabled={isLoading}><Plus className="h-4 w-4 mr-2" />New Entry</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>New Diary Entry</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-4">
                    <Textarea placeholder="Write your thoughts for the day..." value={note} onChange={(e) => setNote(e.target.value)} rows={5} disabled={isLoading}/>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Add a Photo</label>
                        <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} disabled={isLoading}/>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Add a Video</label>
                        <Input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)} disabled={isLoading}/>
                    </div>
                    <Button onClick={handleAddEntry} className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Entry
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && entries.length === 0 ? (
          <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : entries.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>No diary entries yet.</p>
            <p className="text-sm">Click "New Entry" to add one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map(entry => (
              <div key={entry.id} className="border rounded-lg p-4 space-y-2 relative group bg-background/50">
                <p className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                {entry.note && <p className="whitespace-pre-wrap">{entry.note}</p>}
                {entry.photo_url && <img src={entry.photo_url} alt="Diary photo" className="rounded-md w-full h-auto" />} 
                {entry.video_url && <video src={entry.video_url} controls className="rounded-md w-full h-auto" />} 
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => confirmDeleteEntry(entry)} disabled={isLoading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This action cannot be undone. This will permanently delete your diary entry and any associated media.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEntry} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
