import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn, fetchApi } from '@/lib/utils';
import { SharedData } from '@/types';
import { IzinCreateRequest } from '@/types/requests/izin.request';
import { APIResponse } from '@/types/response';
import { Siswa } from '@/types/users';
import { useForm, usePage } from '@inertiajs/react';
import { Plus, Upload, X } from 'lucide-react';
import { useState } from 'react';



export default function IzinFormAddWali() {
    const { auth } = usePage<SharedData>().props;
    const { data, post, setData, reset } = useForm<IzinCreateRequest>({
        created_by: auth.user.id,
        message: '',
        photo: null,
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
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate required fields
        if (data.target_siswa_id === -1) {
            alert('Pilih anak Anda terlebih dahulu');
            return;
        }
        if (!data.message.trim()) {
            alert('Masukkan alasan izin');
            return;
        }
        if (!data.tanggal_pulang || !data.tanggal_kembali) {
            alert('Pilih tanggal pulang dan kembali');
            return;
        }
        
        // Debug: Log form data
        console.log('Form data before submission:', data);
        console.log('Photo file:', data.photo);
        
        // Handle form submission using Inertia post
        post(route('wali.izin.create.post'), {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                setTanggalPulang(undefined);
                setTanggalKembali(undefined);
                setPhotoPreview(null);
                reset();
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                alert('Terjadi kesalahan saat mengirim data: ' + JSON.stringify(errors));
            }
        });
    };

    const handleTanggalPulangSelect = (date: Date | undefined) => {
        setTanggalPulang(date);
        if (date) {
            setData('tanggal_pulang', date.toISOString().split('T')[0]);
        }
        setPulangOpen(false);
    };

    const handleTanggalKembaliSelect = (date: Date | undefined) => {
        setTanggalKembali(date);
        if (date) {
            setData('tanggal_kembali', date.toISOString().split('T')[0]);
        }
        setKembaliOpen(false);
    };

    const loadSiswas = async () => {
        try {
            const resp = await fetchApi<APIResponse<Siswa[]>>(route('wali.anak.api'));
            setSiswas(resp.data);
        } catch (error) {
            console.error('Failed to load siswas:', error);
        }
    };

    // Helper function untuk disable tanggal
    const isPastDate = (date: Date): boolean => {
        const today = new Date();
        const todayString = today.toDateString();
        const dateString = date.toDateString();
        return new Date(dateString) < new Date(todayString);
    };

    const isBeforePulangDate = (date: Date): boolean => {
        if (!tanggalPulang) return false;
        const pulangString = tanggalPulang.toDateString();
        const dateString = date.toDateString();
        return new Date(dateString) < new Date(pulangString);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Hanya file gambar yang diperbolehkan');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                return;
            }

            setData('photo', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setData('photo', null);
        setPhotoPreview(null);
        // Reset file input
        const fileInput = document.getElementById('photo') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Laporan
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-screen overflow-y-auto sm:max-w-[625px]"
                onOpenAutoFocus={loadSiswas}
            >
                <DialogHeader>
                    <DialogTitle>Tambah Izin Siswa</DialogTitle>
                    <DialogDescription>
                        Pengajuan izin oleh siswa untuk keperluan tertentu, seperti keperluan keluarga, kesehatan, atau kegiatan luar sekolah. Data
                        ini digunakan sebagai arsip administratif dan kontrol keluar-masuk siswa.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="nama-siswa" className="text-sm font-medium">
                                Pilih Anak Anda
                            </label>
                            <Select onValueChange={(ev) => setData('target_siswa_id', parseInt(ev))} required>
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
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="photo" className="text-sm font-medium">
                                Foto Bukti Pendukung <span className="text-muted-foreground">(Opsional)</span>
                            </label>
                            <div className="space-y-2">
                                {!photoPreview ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-2">
                                            <label htmlFor="photo" className="cursor-pointer">
                                                <span className="text-sm text-gray-600">
                                                    Klik untuk upload foto atau drag & drop
                                                </span>
                                                <input
                                                    id="photo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG, JPEG hingga 5MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={removePhoto}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="tanggal-pulang" className="text-sm font-medium">
                                    Tanggal Pulang
                                </label>

                                <input
                                    onChange={(e) => setData('tanggal_pulang', e.target.value)}
                                    type="date"
                                    id="tanggal-pulang"
                                    className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="tanggal-kembali" className="text-sm font-medium">
                                    Tanggal Kembali
                                </label>
                                <input
                                    onChange={(e) => setData('tanggal_kembali', e.target.value)}
                                    type="date"
                                    id="tanggal-kembali"
                                    className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
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
