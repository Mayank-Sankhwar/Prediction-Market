import {createClient} from '@supabase/supabase-js'
import { useSupabase } from './useSupabase';
import { useState, useEffect } from 'react';


export function useUser() {
    const [claims, setClaims] = useState<any>(null);
   const supabase = useSupabase();

    useEffect(()=>{
      supabase.auth.getSession().then(({data: {claims}}) => {
        setClaims(claims);
      });
  
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        supabase.auth.getClaims().then(({ data: { claims } }) => {
          setClaims(claims)
        })
      })
   return () => subscription.unsubscribe()
    },[])
    
    return{
        claims
    }
}