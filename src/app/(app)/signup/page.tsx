import React, { ReactElement } from 'react';
import SignupForm from './_components/SignupForm';

export default async function Page(): Promise<ReactElement> {
    return (
        <div className='h-[calc(100vh-3rem)]'>
            <SignupForm />
        </div>
    );
}