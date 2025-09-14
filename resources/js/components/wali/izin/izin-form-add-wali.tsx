import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils'; // Assuming cn and other UI components are available
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import React, { useState, useCallback } from 'react';

// --- Mocks & Types to make the component standalone ---
// In a real application, these would be imported or provided by the framework.

// Mocking framework-specific functions and data
const mockAuth = {
    user: { id: 1, name: 'Wali Murid' }
};

const route = (routeName: string, params: any) => {
    // This is a simple mock. A real app would generate a full URL.
    console.log(`Generating route for: ${routeName}`, params || '');
    return `/mock-api/${routeName.replace(/\./g, '/')}/${params || ''}`;
};

const fetchApi = async (url: string) => {
    // Mock API fetch for demonstration purposes.
    console.log(`Fetching mock data from: ${url}`);
    return Promise.resolve({
        data: [
            { id: 101, name: 'Ahmad Fauzi' },
            { id: 102, name: 'Budi Santoso' },
            { id: 103, name: 'Citra Lestari' },
        ]
    });
};

// Defining types locally since the original files are not available.
interface Siswa {
    id: number;
    name: string;
}

interface IzinCreateRequest {
    created_by: number;
    message: string;
    target_siswa_id: number;
    tanggal_kembali: string;
    tanggal_pulang: string;
}
// --- End of Mocks & Types ---

export default function IzinFormAddWali() {
    // Replace useForm and usePage with standard React state
    const [formData, setFormData] = useState<IzinCreateRequest>({
        created_by: mockAuth.user.id,
        message: '',
        target_siswa_id: -1,
        tanggal_kembali: '',
        tanggal_pulang: '',
    });

    const [siswas, setSiswas] = useState<Siswa[]>([]);
    const [open, setOpen] = useState(false);
    const [pulangOpen, setPulangOpen] = useState(false);
    const [kembaliOpen, setKembaliOpen] = useState(false);
    const [tanggalPulang, setTanggalPulang] = useState<Date | undefined>(undefined);
    const [tanggalKembali, setTanggalKembali] = useState<Date | undefined>(undefined);

    const resetForm = useCallback(() => {
        setFormData({
            created_by: mockAuth.user.id,
            message: '',
            target_siswa_id: -1,
            tanggal_kembali: '',
            tanggal_pulang: '',
        });
        setTanggalPulang(undefined);
        setTanggalKembali(undefined);
    }, []);
    
    // Generic handler to update form data
    const handleValueChange = (field: keyof IzinCreateRequest, value: string | number) => {
        setFormData(prev => ({...prev, [field]: value}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate required fields
        if (formData.target_siswa_id === -1) {
            alert('Pilih anak Anda terlebih dahulu');
            return;
        }
        if (!formData.message.trim()) {
            alert('Masukkan alasan izin');
            return;
        }
        if (!formData.tanggal_pulang || !formData.tanggal_kembali) {
            alert('Pilih tanggal pulang dan kembali');
            return;
        }
        
        // Handle form submission with a standard fetch
        console.log('Submitting form data:', formData);
        // In a real app, you would replace this with a real API call
        // For demonstration, we'll simulate a successful submission
        alert('Pengajuan izin berhasil disimulasikan!');
        setOpen(false);
        resetForm();
    };

    // Callback for when the dialog opens
    const onOpenAutoFocus = useCallback((e: Event) => {
        // Prevent default focus behavior
        e.preventDefault();
        // Fetch student data
        fetchApi(route('wali.anak.api', null)).then((resp) => setSiswas(resp.data));
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Laporan
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-screen overflow-y-auto sm:max-w-[625px]"
                onOpenAutoFocus={onOpenAutoFocus}
            >
                <DialogHeader>
                    <DialogTitle>Tambah Izin Siswa</DialogTitle>
                    <DialogDescription>
                        Pengajuan izin oleh siswa untuk keperluan tertentu. Data ini digunakan sebagai arsip administratif.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nama-siswa" className="text-sm font-medium">
                                Pilih Anak Anda
                            </label>
                            <Select onValueChange={(ev) => handleValueChange('target_siswa_id', parseInt(ev))} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Anak Anda" />
                                </SelectTrigger>
                                <SelectContent>
                                    {siswas.map((v) => (
                                        <SelectItem key={v.id} value={`${v.id}`}>{v.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="alasan" className="text-sm font-medium">
                                Alasan
                            </label>
                            <Textarea
                                id="alasan"
                                placeholder="Masukkan alasan yang jelas dan lengkap"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => handleValueChange('message', e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">Tanggal Pulang</label>
                                <Popover open={pulangOpen} onOpenChange={setPulangOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {tanggalPulang ? format(tanggalPulang, 'PPP') : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 z-[100]" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={tanggalPulang}
                                            onSelect={(date) => {
                                                setTanggalPulang(date);
                                                if (date) {
                                                    handleValueChange('tanggal_pulang', date.toISOString().split('T')[0]);
                                                }
                                                setPulangOpen(false);
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">Tanggal Kembali</label>
                                <Popover open={kembaliOpen} onOpenChange={setKembaliOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn('w-full justify-start text-left font-normal', !tanggalKembali && 'text-muted-foreground')}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {tanggalKembali ? format(tanggalKembali, 'PPP') : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 z-[100]" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={tanggalKembali}
                                            onSelect={(date) => {
                                                setTanggalKembali(date);
                                                if (date) {
                                                    handleValueChange('tanggal_kembali', date.toISOString().split('T')[0]);
                                                }
                                                setKembaliOpen(false);
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="pt-2">
                        <Button type="submit" variant={'default'}>
                            Tambah Data
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

