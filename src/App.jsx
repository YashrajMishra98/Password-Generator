import { useState, useCallback, useEffect, useRef } from 'react';

// The main App component for the password generator.
function App() {
  const [length, setLength] = useState(12); // Default length to 12 for better security
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  // useRef hook to reference the password input field.
  const passwordRef = useRef(null);

  /**
   * Generates a new random password based on the current settings.
   * This function is memoized with useCallback to prevent unnecessary re-creations.
   */
  const generatePassword = useCallback(() => {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    if (numberAllowed) {
      str += '0123456789';
    }
    if (charAllowed) {
      str += '!@#$%^&*()_+=-`~[]{}|;:\'"<>,./?';
    }

    for (let i = 0; i < length; i++) {
      const char = Math.floor(Math.random() * str.length);
      pass += str[char];
    }
    setPassword(pass);
    setCopyStatus(''); // Reset copy status when new password is generated
  }, [length, numberAllowed, charAllowed]);

  /**
   * Copies the generated password to the clipboard and shows a status message.
   * Uses the recommended `document.execCommand('copy')` for compatibility.
   */
  const copyPasswordToClipboard = useCallback(() => {
    // Select the password text in the input field.
    passwordRef.current?.select();
    // Select a wider range for mobile devices.
    passwordRef.current?.setSelectionRange(0, 999);

    try {
      // Execute the copy command.
      document.execCommand('copy');
      setCopyStatus('Copied!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed to copy.');
    }

    // Reset the copy status after 2 seconds.
    setTimeout(() => {
      setCopyStatus('');
    }, 2000);
  }, [password]);

  // useEffect hook to regenerate the password whenever the settings change.
  useEffect(() => {
    generatePassword();
  }, [length, numberAllowed, charAllowed, generatePassword]);

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 to-blue-950 font-sans p-4'>
      <div className='w-full max-w-xl mx-auto p-8 my-8 bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:shadow-cyan-500/30'>
        <h1 className='text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'>
          Secure Password Generator
        </h1>
        <div className='flex rounded-2xl overflow-hidden mb-6 shadow-xl border border-slate-700'>
          <input
            type='text'
            value={password}
            className='flex-grow outline-none py-4 px-6 text-lg font-mono text-gray-900 bg-slate-200 placeholder-gray-500 rounded-l-2xl'
            placeholder='Your new password'
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className='bg-blue-600 text-white font-semibold px-6 py-4 shrink-0 transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800'
          >
            {copyStatus || (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v-1a2 2 0 012-2h4a2 2 0 012 2v1m-4 5h4m-4-2v-1h4v1m0 0v-1a2 2 0 00-2-2h-4a2 2 0 00-2 2v1m-4 5a2 2 0 01-2-2v-4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H8z" />
              </svg>
            )}
          </button>
        </div>

        <div className='flex flex-col gap-6'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex items-center gap-x-2 w-full'>
              <input
                type='range'
                min={6}
                max={100}
                value={length}
                className='cursor-pointer w-full accent-cyan-400'
                onChange={(e) => setLength(Number(e.target.value))}
                aria-label='Password length slider'
              />
              <label htmlFor='length' className='text-lg font-medium whitespace-nowrap text-blue-300'>
                Length: {length}
              </label>
            </div>
          </div>
          
          <div className='flex flex-wrap items-center justify-center sm:justify-between gap-4'>
            <div className='flex items-center gap-x-2'>
              <input
                type='checkbox'
                checked={numberAllowed}
                onChange={() => setNumberAllowed((prev) => !prev)}
                className='h-5 w-5 rounded text-blue-600 border-gray-300 cursor-pointer focus:ring-blue-500'
                id='numberInput'
              />
              <label htmlFor='numberInput' className='text-md text-slate-300'>
                Numbers
              </label>
            </div>
            <div className='flex items-center gap-x-2'>
              <input
                type='checkbox'
                checked={charAllowed}
                onChange={() => setCharAllowed((prev) => !prev)}
                className='h-5 w-5 rounded text-blue-600 border-gray-300 cursor-pointer focus:ring-blue-500'
                id='charInput'
              />
              <label htmlFor='charInput' className='text-md text-slate-300'>
                Characters
              </label>
            </div>
            <button
              onClick={generatePassword}
              className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-800'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.564 1 1 0 01-1.639 1.153A5.002 5.002 0 006 7V5.101a1 1 0 011.621-.69l2.553 2.553a.75.75 0 001.06-1.06L9.68 4.351a.75.75 0 00-1.06-1.06L5.94 5.97a1 1 0 01-1.621-.69V3a1 1 0 011-1zM4 17a1 1 0 01-1-1v-2.101a7.002 7.002 0 0111.601-2.564 1 1 0 011.639-1.153A5.002 5.002 0 0014 13v1.899a1 1 0 01-1.621.69l-2.553-2.553a.75.75 0 00-1.06 1.06l2.553 2.553a.75.75 0 001.06 1.06l2.553-2.553a1 1 0 011.621.69V16a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
