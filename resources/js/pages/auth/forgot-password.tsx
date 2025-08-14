// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Lupa password" description="Masukkan email Anda untuk menerima link reset password.">
            <Head title="Lupa password" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="w-full rounded-lg border border-gray-300 px-4 py-5 !text-black transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full bg-primary px-4 py-5 font-medium text-white hover:bg-emerald-800" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Kirim
                        </Button>
                    </div>
                </form>

                <div className="text-gray-600 space-x-1 text-center text-sm">
                    <span>Atau, kembali ke</span>
                    <TextLink className="text-primary" href={route('login')}>
                        log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
