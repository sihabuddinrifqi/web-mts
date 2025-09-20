<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.4;
        }

        /* Header (kop surat) */
        .header-table {
            width: 100%;
            border-bottom: 3px double black;
            margin-bottom: 15px;
        }
        .header-table td {
            vertical-align: middle;
            text-align: center;
            border: none; /* hilangkan border pada sel */
        }
        .header-logo {
            width: 110px;
            text-align: left;
        }
        .header-logo img {
            width: 100px;
            height: 100px;
        }
        .header-text {
            text-align: center;
        }
        .madrasah {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .pondok {
            font-size: 16px;
            font-weight: bold;
        }
        .address, .contact, .nsm-npsn {
            font-size: 11px;
        }

        .main-title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            text-decoration: underline;
            margin: 20px 0;
        }
        .subtitle {
            font-size: 12px;
            margin-bottom: 5px;
        }
        .date-info {
            font-size: 10px;
            text-align: right;
            margin-bottom: 15px;
        }

        /* Tabel isi */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid black;
            padding: 4px;
            text-align: center;
            font-size: 10px;
        }
        th {
            background-color: #e9e9e9;
            font-weight: bold;
        }

        /* Status warna */
        .status-hadir { background-color: #d4edda; color: #155724; font-weight: bold; }
        .status-sakit { background-color: #fff3cd; color: #856404; font-weight: bold; }
        .status-izin  { background-color: #d1ecf1; color: #0c5460; font-weight: bold; }
        .status-alpha { background-color: #f8d7da; color: #721c24; font-weight: bold; }

        .summary-table {
            width: 50%;
            margin-top: 20px;
            border-collapse: collapse;
        }
        .summary-table th, .summary-table td {
            border: 1px solid black;
            padding: 4px;
            text-align: left;
        }
        .summary-table th {
            background-color: #e9e9e9;
        }

        /* TTD */
        .ttd {
            width: 100%;
            margin-top: 50px;
            border: none; /* hilangkan border tabel tanda tangan */
        }
        .ttd td {
            vertical-align: top;
            text-align: center;
            width: 50%;
            border: none; /* hilangkan border pada sel */
        }
        .ttd .right {
            text-align: right;
            padding-right: 50px;
        }
    </style>
</head>
<body>
    <!-- Kop Surat -->
    <table class="header-table">
        <tr>
            <td class="header-logo">
                <img src="{{ public_path('logo.png') }}" alt="Logo Madrasah">
            </td>
            <td class="header-text">
                <div class="madrasah">MADRASAH TSANAWIYAH</div>
                <div class="pondok">"ASH – SHOLIHIN"</div>
                <div class="address">
                    Kemiri RT 02 RW 06 Bumiroso Watumalang Wonosobo 56352 Jawa Tengah
                </div>
                <div class="contact">
                    WA : 0823 3184 8872 | Email : mtsashsholihin@gmail.com
                </div>
                <div class="nsm-npsn">
                    NSM : 121233070051 &nbsp;&nbsp; NPSN : 70044220
                </div>
            </td>
        </tr>
    </table>

    <div class="header">
        <div class="main-title">{{ $title }}</div>
        <div class="subtitle">Nama: {{ $siswa->name }}</div>
        <div class="subtitle">NIS: {{ $siswa->nis }}</div>
    </div>

    <div class="date-info">
        <p>Tanggal Cetak: {{ $print_date }}</p>
    </div>

    <!-- Presensi Table -->
    <table>
        <thead>
            <tr>
                <th style="width: 10%;">No</th>
                <th style="width: 20%;">Tanggal</th>
                <th style="width: 20%;">Pelajaran</th>
                <th style="width: 20%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($siswa->presensi as $index => $p)
                <tr class="status-{{ $p->status }}">
                    <td>{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($p->tanggal)->format('d/m/Y') }}</td>
                    <td>{{ $p->pelajaran->nama_pelajaran ?? '-' }}</td>
                    <td>
                        @if($p->status === 'hadir') H
                        @elseif($p->status === 'sakit') S
                        @elseif($p->status === 'izin') I
                        @else A
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align:center;">Belum ada data presensi.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Summary -->
    <table class="summary-table">
        <thead>
            <tr>
                <th>Keterangan</th>
                <th>Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Hadir (H)</td><td>{{ $summary['hadir'] }}</td></tr>
            <tr><td>Sakit (S)</td><td>{{ $summary['sakit'] }}</td></tr>
            <tr><td>Izin (I)</td><td>{{ $summary['izin'] }}</td></tr>
            <tr><td>Alpha (A)</td><td>{{ $summary['alpha'] }}</td></tr>
            <tr style="font-weight:bold;background:#f0f0f0;">
                <td>Total</td><td>{{ $summary['total'] }}</td>
            </tr>
        </tbody>
    </table>

    <!-- Bagian Tanda Tangan -->
    <table class="ttd">
        <tr>
            <td></td>
            <td class="right">
                Wonosobo, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}<br>
                Wali Kelas<br><br><br><br>
                <u>{{ $walikelas['name'] ?? '________________' }}</u><br>
                NIP. {{ $walikelas['nip'] ?? '__________' }}
            </td>
        </tr>
    </table>
</body>
</html>
