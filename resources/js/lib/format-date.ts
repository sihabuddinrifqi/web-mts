export default function formatDate(inputDate: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const formattedDate: string = new Date(inputDate).toLocaleDateString('id-ID', options);
    return formattedDate;
}

export function ConvertToIndonesianDate(dateRange: string): string {
    const monthNames: string[] = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ];

    const [startDate, endDate] = dateRange.split(' - ');

    const formatDate = (dateStr: string): string => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return `${day} ${monthNames[month - 1]} ${year}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function TranslateDayToIndonesian(day: string): string {
    const daysMap: { [key: string]: string } = {
        monday: 'Senin',
        tuesday: 'Selasa',
        wednesday: 'Rabu',
        thursday: 'Kamis',
        friday: 'Jumat',
        saturday: 'Sabtu',
        sunday: 'Minggu',
    };

    return daysMap[day] || 'Invalid day';
}
