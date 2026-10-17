import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useEffect } from 'react';

type Lead = {
    id: number;
    name: string;
    email: string;
    status: 'new' | 'engaged' | 'proposal_sent' | 'closed_won' | 'closed_lost';
    created_at: string;
};

type LeadsIndexProps = {
    leads: Lead[];
};

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'engaged', label: 'Engaged' },
    { value: 'proposal_sent', label: 'Proposal Sent' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' },
];

const statusColors: Record<Lead['status'], string> = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    engaged: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    proposal_sent: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    closed_won: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    closed_lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function LeadsIndex({ leads }: LeadsIndexProps) {
    const { props } = usePage();
    const flash = (props as Record<string, unknown>).flash as { type?: string; message?: string } | undefined;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        status: 'new' as Lead['status'],
    });

    useEffect(() => {
        if (flash?.message) {
            const showToast = flash.type === 'success'
                ? toast.success
                : flash.type === 'error'
                  ? toast.error
                  : flash.type === 'warning'
                    ? toast.warning
                    : toast.info;
            showToast(flash.message);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/leads', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Leads" />
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted-foreground">Manage your sales leads</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Create Lead Form */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Create New Lead</CardTitle>
                            <CardDescription>Add a new lead to your pipeline</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value as Lead['status'])}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Lead'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Leads List */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>All Leads</CardTitle>
                            <CardDescription>{leads.length} lead(s) in your pipeline</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {leads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-muted-foreground">No leads yet. Create your first lead!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {leads.map((lead) => (
                                        <div
                                            key={lead.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-medium">{lead.name}</p>
                                                <p className="text-muted-foreground text-sm">{lead.email}</p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[lead.status]}`}
                                            >
                                                {statusOptions.find((s) => s.value === lead.status)?.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
