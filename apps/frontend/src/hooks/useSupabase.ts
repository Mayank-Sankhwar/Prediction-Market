import {useEffect, useState} from 'react';
import {createClient} from '@supabase/supabase-js';
export function useSupabase() {

    const supabase = createClient("https://ydhmphjngomaionfbmqu.supabase.co", "sb_publishable_v2bVeKRRgw0Xa-vhlSmZgQ_Be-qv9KA")

return supabase;
}