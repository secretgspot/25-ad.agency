import { json } from '@sveltejs/kit';

export async function POST({ params, locals: { supabase } }) {
    const { id } = params;

    try {
        const { error } = await supabase
            .rpc('increment_ad_clicks', { ad_id: id });

        if (error) {
            console.error('Supabase error incrementing ad click:', error);
            return json({ message: 'Failed to increment ad click', details: error.message }, { status: 500 });
        }

        return json({ message: 'Ad click incremented successfully' }, { status: 200 });
    } catch (err) {
        console.error('Unexpected error incrementing ad click:', err);
        return json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
