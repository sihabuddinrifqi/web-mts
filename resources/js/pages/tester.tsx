import { MultiSelect } from '@/components/ui/multiselect';

interface siswaData {
    data: siswa[];
}
interface siswa {
    name: string;
}
const dataSiswa = [{ name: 'abc' }, { name: 'abc' }, { name: 'abc' }, { name: 'abc' }, { name: 'abc' }, { name: 'abc' }, { name: 'abc' }];
export default function Page({ prop }: { prop: siswaData }) {
    console.log(prop);
    return (
        <>
            <MultiSelect
                options={dataSiswa.map((v, i) => ({
                    label: v.name + i,
                    value: v.name + i,
                }))}
                onValueChange={(v) => {}}
            />
        </>
    );
}
