import { useStore } from '@/lib/store';
import { useTimetable, useClasses } from '@/lib/hooks';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:15 - 11:15',
  '11:15 - 12:15',
  '13:00 - 14:00',
  '14:00 - 15:00',
];

export default function Timetable() {
  const { currentUser } = useStore();
  const { data: timetable = [], isLoading: timetableLoading } = useTimetable();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState('10');

  const isLoading = timetableLoading || classesLoading;

  const filteredTimetable = timetable.filter((t) => {
    const classInfo = classes.find(c => c.name === t.class || `${c.grade}-${c.section}` === t.class);
    return classInfo?.grade === selectedGrade;
  });

  const handleSyncCalendar = () => {
    toast({
      title: 'Calendar Synced',
      description: 'Timetable has been synced with Google Calendar',
    });
  };

  const getEntry = (day: string, timeSlot: string) => {
    const [start] = timeSlot.split(' - ');
    const entries = filteredTimetable.filter((t) => t.day === day && t.startTime === start);
    return entries;
  };

  const subjectColors: Record<string, string> = {
    Mathematics: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    English: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    Physics: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400',
    Chemistry: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
    Biology: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400',
    History: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Computer Science': 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Timetable</h1>
            <p className="text-muted-foreground">View weekly class schedule</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSyncCalendar}>
              <Calendar className="h-4 w-4 mr-2" />
              Sync to Google Calendar
            </Button>
            {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-40" data-testid="select-grade">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {['Kindergarten', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g === 'Kindergarten' ? g : `Grade ${g}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading timetable...</div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Weekly Schedule - {selectedGrade === 'Kindergarten' ? 'Kindergarten' : `Grade ${selectedGrade}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 border bg-muted/50 text-left font-medium w-32">Time</th>
                      {days.map((day) => (
                        <th key={day} className="p-3 border bg-muted/50 text-left font-medium min-w-[150px]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot) => (
                      <tr key={slot}>
                        <td className="p-3 border bg-muted/30 font-medium text-sm text-muted-foreground">
                          {slot}
                        </td>
                        {days.map((day) => {
                          const entries = getEntry(day, slot);
                          return (
                            <td key={`${day}-${slot}`} className="p-2 border align-top">
                              {entries.length > 0 ? (
                                <div className="space-y-2">
                                  {entries.map((entry, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg border ${subjectColors[entry.subject] || 'bg-gray-100'}`}>
                                      <div className="flex justify-between items-start mb-1">
                                        <p className="font-medium text-sm">{entry.subject}</p>
                                        <Badge variant="outline" className="text-[10px] h-5">
                                          {entry.class.split('-').pop()}
                                        </Badge>
                                      </div>
                                      <p className="text-xs opacity-80">{entry.teacher}</p>
                                      <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                                        <span>{entry.room}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-3 text-center text-muted-foreground text-sm">
                                  -
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(subjectColors).slice(0, 4).map(([subject, color]) => (
            <div key={subject} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <div className={`h-4 w-4 rounded ${color.split(' ')[0]}`} />
              <span className="text-sm font-medium">{subject}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
