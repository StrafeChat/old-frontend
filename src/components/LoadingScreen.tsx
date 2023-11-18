import React from 'react';
import quotes from "@/assets/loading.json";
import Image from 'next/image'
export default function LoadingScreen() {

    return (
        <div className='loading flex items-center justify-center flex-col h-full'>
           
                    
                    <div className='flex flex-row items-center justify-center'>
                    <Image className='select-none' src="/Spinner-1s-200px.svg" width={86} height={86} alt='loader' />
                    </div>
                    <br></br>
                
                <div className='' suppressHydrationWarning>
                {quotes[Math.floor(Math.random() * quotes.length)]}
                </div>
            </div>
    );
}
