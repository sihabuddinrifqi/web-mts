interface siswaData {
    data: siswa[];
}
interface siswa {
    name: string;
}

export default function Page({ prop }: { prop: siswaData }) {
    console.log(prop);
    return (
        <>
            <p>{JSON.stringify(prop)}</p>
        </>
    );
}
