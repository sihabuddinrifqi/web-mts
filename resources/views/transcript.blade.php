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
            border-bottom: 3px double black; /* garis batas tebal */
            margin-bottom: 15px;
        }
        .header-table td {
            vertical-align: middle;
            text-align: center;
        }
        .header-logo {
            width: 110px;
            text-align: left;
        }
        .header-logo img {
            width: 110px;
            height: 110px;
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

        .info-table {
            width: 60%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 2px 5px;
        }

        .grades-table {
            width: 100%;
            border-collapse: collapse;
        }
        .grades-table th, .grades-table td {
            border: 1px solid black;
            padding: 5px;
            text-align: center;
        }
        .grades-table th {
            background-color: #e9e9e9;
        }
        .footer-row td {
            font-weight: bold;
            text-align: right;
            background-color: #e9e9e9;
        }

        /* Bagian tanda tangan */
        .ttd {
            width: 100%;
            margin-top: 50px;
        }
        .ttd td {
            vertical-align: top;
            text-align: center;
            width: 50%;
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

    <div class="content">
        <div class="main-title">TRANSKRIP NILAI</div>

        <!-- Student Information -->
        <table class="info-table">
            <tr>
                <td style="width: 30%;">Nama</td>
                <td style="width: 5%;">:</td>
                <td style="width: 65%;">{{ $student['name'] }}</td>
            </tr>
            <tr>
                <td>NIS</td>
                <td>:</td>
                <td>{{ $student['nis'] }}</td>
            </tr>
            <tr>
                <td>Tempat/Tgl Lahir</td>
                <td>:</td>
                <td>{{ $student['birth_info'] }}</td>
            </tr>
            <tr>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>{{ $student['gender'] }}</td>
            </tr>
        </table>

        <!-- Grades Table -->
        <table class="grades-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Pelajaran</th>
                    <th>Semester</th>
                    <th>UH</th>
                    <th>PTS</th>
                    <th>PAS</th>
                    <th>Rata-Rata Nilai</th>
                </tr>
            </thead>
            <tbody>
                @forelse($subjects as $index => $subject)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $subject['name'] }}</td>
                    <td>{{ $subject['semester'] }}</td>
                    <td>{{ $subject['uh'] }}</td>
                    <td>{{ $subject['pts'] }}</td>
                    <td>{{ $subject['pas'] }}</td>
                    <td>{{ $subject['nilai_akhir'] }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="7">Belum ada data nilai.</td>
                </tr>
                @endforelse
            </tbody>
            <tfoot>
                <tr class="footer-row">
                    <td colspan="6">Rata-Rata Keseluruhan</td>
                    <td>{{ $average }}</td>
                </tr>
            </tfoot>
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
    </div>
</body>
</html>
