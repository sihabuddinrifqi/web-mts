'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Nilai, Pelajaran, NilaiDetail } from '@/types/pelajaran';
import { APIResponse } from '@/types/response';
import { ArrowDownUp, BookOpenText, PenBox, Save, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

// Helper function to find a specific grade from the detail array
const findGrade = (details: NilaiDetail[] | undefined, type: 'UH' | 'PTS' | 'PAS'): number | string => {
    if (!details) return '';
    const found = details.find((d) => d.jenis === type);
    return found ? found.nilai : '';
};

export default function LessonViewGuru({ pelajaran }: { pelajaran: Pelajaran }) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    // State to hold the three edited grade values
    const [editedGrades, setEditedGrades] = useState({ uh: '', pts: '', pas: '' });
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortByHighest, setSortByHighest] = useState<boolean>(false);

    const [studentsData, setStudentsData] = useState<Nilai[]>([]);
    const [displayedData, setDisplayedData] = useState<Nilai[]>([]);

    // Effect for filtering and sorting data
    useEffect(() => {
        let processedData = [...studentsData];

        if (searchQuery) {
            processedData = processedData.filter((student) =>
                student.siswa?.name.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Note: Sorting logic might need adjustment based on which of the 3 grades to sort by.
        setDisplayedData(processedData);
    }, [searchQuery, sortByHighest, studentsData]);

    // Function to handle entering edit mode for a student
    const handleEditClick = (index: number): void => {
        const studentNilai = displayedData[index];
        setEditingIndex(index);
        // Populate the edit form with existing grades
        setEditedGrades({
            uh: findGrade(studentNilai.detail, 'UH').toString(),
            pts: findGrade(studentNilai.detail, 'PTS').toString(),
            pas: findGrade(studentNilai.detail, 'PAS').toString(),
        });
    };

    // Function to handle saving the three new grades
    const handleSaveClick = async (index: number) => {
        const studentToUpdate = displayedData[index];
        if (!studentToUpdate.siswa) return;

        // 1. Get CSRF token and handle if it's missing
        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
        if (!csrfToken) {
            console.error('CSRF token not found. Make sure you have a <meta name="csrf-token"> tag in your layout.');
            return; // Stop the function if token is not found
        }

        // Prepare data for the backend
        const payload = {
            siswa_id: studentToUpdate.siswa.id,
            pelajaran_id: pelajaran.id,
            semester: pelajaran.semester,
            ulangan_harian: editedGrades.uh,
            pts: editedGrades.pts,
            pas: editedGrades.pas,
        };

        try {
            // Use a direct URL path instead of the route() helper for simplicity
            const response = await fetch('/guru/nilai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken, // Now guaranteed to be a string
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Log detailed error from backend if available
                const errorData = await response.json();
                console.error('Server responded with an error:', errorData);
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const result: APIResponse<Nilai> = await response.json();

            // Update the local state with the new data from the server
            const updatedStudents = studentsData.map((student) =>
                student.id === result.data.id ? result.data : student,
            );
            setStudentsData(updatedStudents);
            setEditingIndex(null); // Exit editing mode
        } catch (error) {
            console.error('Failed to save grades:', error);
            // Optionally, show an error message to the user
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <BookOpenText className="mr-2 h-4 w-4" /> Input Nilai
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-screen overflow-y-auto sm:max-w-3xl" // Increased width for more columns
                onOpenAutoFocus={() =>
                    // Use standard browser 'fetch' to get data
                    fetch(route('api.detail.pelajaran.nilai', pelajaran.id))
                        .then(res => res.json())
                        .then((resp: APIResponse<Nilai[]>) => {
                            setStudentsData(resp.data);
                            setDisplayedData(resp.data);
                        })
                        .catch(err => console.error("Failed to fetch student grades:", err))
                }
            >
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-center">Input Nilai Siswa</DialogTitle>
                    <DialogDescription className="mx-auto max-w-sm text-center">
                        Input nilai Ulangan Harian (UH), PTS, dan PAS untuk pelajaran {pelajaran.nama_pelajaran}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                            placeholder="Cari nama siswa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="overflow-hidden rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">NIS</th>
                                    <th className="px-4 py-3 text-left font-medium">Nama Siswa</th>
                                    <th className="w-24 px-4 py-3 text-center font-medium">UH</th>
                                    <th className="w-24 px-4 py-3 text-center font-medium">PTS</th>
                                    <th className="w-24 px-4 py-3 text-center font-medium">PAS</th>
                                    <th className="w-28 px-4 py-3 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedData.length > 0 ? (
                                    displayedData.map((student, index) => (
                                        <tr key={student.id} className="border-t">
                                            <td className="px-4 py-2">{student.siswa?.nis}</td>
                                            <td className="px-4 py-2">{student.siswa?.name}</td>
                                            {editingIndex === index ? (
                                                <>
                                                    {/* Inputs for editing */}
                                                    <td>
                                                        <Input
                                                            type="number"
                                                            value={editedGrades.uh}
                                                            onChange={(e) => setEditedGrades({ ...editedGrades, uh: e.target.value })}
                                                            className="h-8 w-full rounded border px-2 text-center"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="number"
                                                            value={editedGrades.pts}
                                                            onChange={(e) => setEditedGrades({ ...editedGrades, pts: e.target.value })}
                                                            className="h-8 w-full rounded border px-2 text-center"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="number"
                                                            value={editedGrades.pas}
                                                            onChange={(e) => setEditedGrades({ ...editedGrades, pas: e.target.value })}
                                                            className="h-8 w-full rounded border px-2 text-center"
                                                        />
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Displaying grades */}
                                                    <td className="px-4 py-2 text-center">{findGrade(student.detail, 'UH')}</td>
                                                    <td className="px-4 py-2 text-center">{findGrade(student.detail, 'PTS')}</td>
                                                    <td className="px-4 py-2 text-center">{findGrade(student.detail, 'PAS')}</td>
                                                </>
                                            )}
                                            <td className="px-4 py-2 text-right">
                                                {editingIndex === index ? (
                                                    <Button size="sm" onClick={() => handleSaveClick(index)}>
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" onClick={() => handleEditClick(index)}>
                                                        <PenBox className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                 ) : (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-4 text-center">
                                            Tidak ada siswa yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
