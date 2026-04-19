// Animated Login / Sign-Up page inspired by provided HTML/CSS snippet
//* Import background image from /image folder */image supplied by user.

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';

export default function AnimatedLogin() {
  /* ---------------- State ---------------- */
  const [mode, setMode] = useState(''); // '', 'login', 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  /* ---------------- Auth ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    if (result?.error) {
      setError(result.error);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <>
      {/* Google fonts & material icons */}
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <title>Login | Food Discount</title>
      </Head>

      <div className="cotn_principal">
        <div className="cont_centrar">
          <div className="cont_login">
            {/* Info panels */}
            <div className="cont_info_log_sign_up">
              <div className="col_md_login">
                <div className="cont_ba_opcitiy">
                  <h2>LOGIN</h2>
                  <p>Access exclusive food deals and discounts.</p>
                  <button className="btn_login" onClick={() => setMode('login')}>LOGIN</button>
                </div>
              </div>
              <div className="col_md_sign_up">
                <div className="cont_ba_opcitiy">
                  <h2>SIGN UP</h2>
                  <p>New here? Create an account to start saving.</p>
                  <button className="btn_sign_up" onClick={() => setMode('signup')}>SIGN UP</button>
                </div>
              </div>
            </div>

            {/* Background image containers */}
            <div className="cont_back_info">
              <div className="cont_img_back_grey" />
            </div>

            {/* Forms */}
            <div
              className={`cont_forms ${
                mode === 'login'
                  ? 'cont_forms_active_login'
                  : mode === 'signup'
                  ? 'cont_forms_active_sign_up'
                  : ''
              }`}
            >
              <div className="cont_img_back_" />

              {/* Login form */}
              <div
                className="cont_form_login"
                style={{ display: mode === 'login' ? 'block' : 'none', opacity: mode === 'login' ? 1 : 0 }}
              >
                <a href="#" onClick={() => setMode('')}><i className="material-icons">&#xE5C4;</i></a>
                <h2>LOGIN</h2>
                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  {error && <p style={{ color: '#e53935', fontSize: '0.9rem', marginTop: '10px' }}>{error}</p>}
                  <button type="submit" className="btn_login" style={{ marginTop: '15px' }}>LOGIN</button>
                </form>
              </div>

              {/* Sign-up form placeholder */}
              <div
                className="cont_form_sign_up"
                style={{ display: mode === 'signup' ? 'block' : 'none', opacity: mode === 'signup' ? 1 : 0 }}
              >
                <a href="#" onClick={() => setMode('')}><i className="material-icons">&#xE5C4;</i></a>
                <h2>SIGN UP</h2>
                <input type="email" placeholder="Email" />
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
                <button className="btn_sign_up" style={{ marginTop: '15px' }}>SIGN UP</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hide site header & footer on login page */}
      <style jsx global>{`
        header, footer { display:none !important; }
      `}</style>

      {/* Styles */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          text-align: center;
          font-family: 'Open Sans', sans-serif;
        }

        :root {
          --login-bg: url('/image/pexels-valeriya-1639563.jpg');
          --login-bg: url('https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=1600&q=80');
        }

        .cotn_principal {
            position: relative;
            width: 100%;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* blurred background layer */
          .cotn_principal::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: var(--login-bg);
            background-size: cover;
            background-position: center;
            filter: brightness(1.3) blur(3px);
            opacity: 0.35;
            z-index: -1;
          }
          position: absolute;
          width: 100%;
          display: flex;
          height: 100%;
          background: #cfd8dc;
          background: linear-gradient(135deg, #cfd8dc 0%, #607d8b 100%, #b0bec5 100%);
        }
        .cont_centrar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }
          display: flex;
          align-self: center;
          width: 100%;
        }
        .cont_login {
          position: relative;
          width: 700px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0,0,0,.25);
        }
          position: relative;
          width: 640px;
        }
        .cont_back_info {
          display:none;
          position: relative;
          float: left;
          width: 640px;
          height: 400px; /* increased */
          overflow: hidden;
          background-color: #fff;
          box-shadow: 1px 10px 30px -10px rgba(0, 0, 0, 0.5);
        }
          position: relative;
          float: left;
          width: 640px;
          height: 280px;
          overflow: hidden;
          background-color: #fff;
          box-shadow: 1px 10px 30px -10px rgba(0, 0, 0, 0.5);
        }
        .cont_forms {
          position: relative;
          margin: 0 auto 40px;
          width: 90%;
          max-width: 400px;
          height: auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding-top: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,.15);
          transition: all 0.4s ease;
        }
          position: absolute;
          overflow: hidden;
          top: 0;
          left: 0;
          width: 320px;
          height: 400px; /* increased */
          background-color: #eee;
          transition: all 0.5s;
        }
          position: absolute;
          overflow: hidden;
          top: 0;
          left: 0;
          width: 320px;
          height: 280px;
          background-color: #eee;
          transition: all 0.5s;
        }
        .cont_forms_active_login {
          box-shadow: 1px 10px 30px -10px rgba(0, 0, 0, 0.5);
          height: 500px;
          top: -50px;
        }
          box-shadow: 1px 10px 30px -10px rgba(0, 0, 0, 0.5);
          height: 420px;
          top: -60px;
        }
        .cont_forms_active_sign_up {
          box-shadow: 1px 10px 30px -10px rgba(0, 0, 0, 0.5);
          height: 500px;
          top: -50px;
          left: 320px;
        }
          box-shadow: 1px 10px 30px -10px rgba(0, 0, 0, 0.5);
          height: 420px;
          top: -60px;
          left: 320px;
        }
        .cont_img_back_grey,
        .cont_img_back_ {
          position: absolute;
          width: 950px;
          top: -80px;
          left: -116px;
          background-image: var(--login-bg);
          background-size: cover;
          background-position: center;
          filter: grayscale(100%);
          opacity: 0.25;
          animation: animar_fondo 20s linear infinite alternate;
        }
        .cont_img_back_ {
          filter: none;
          opacity: 0.35;
        }
        @keyframes animar_fondo {
          from {
            transform: scale(1) translate(0);
          }
          to {
            transform: scale(1.5) translate(50px);
          }
        }
        .cont_info_log_sign_up {
          position: relative;
          display: flex;
          width: 100%;
          height: 150px;
          z-index: 1;
        }
          position: absolute;
          width: 640px;
          height: 280px;
          top: 0;
          z-index: 1;
        }
        .col_md_login,
        .col_md_sign_up
        .col_md_sign_up {
          position: relative;
          float: left;
          flex: 1;
        }
        .cont_ba_opcitiy {
          position: relative;
          background-color: rgba(120, 144, 156, 0.55);
          width: 90%;
          border-radius: 8px;
          margin: 20px auto 0;
          padding: 20px 10px;
        }
          position: relative;
          background-color: rgba(120, 144, 156, 0.55);
          width: 80%;
          border-radius: 3px;
          margin-top: 60px;
          padding: 15px 0;
        }
        .cont_ba_opcitiy h2 {
          font-weight: 400;
          color: #fff;
        }
        .cont_ba_opcitiy p {
          font-weight: 400;
          margin-top: 15px;
          color: #fff;
        }
        .btn_login {
          background-color: #26c6da;
          border: none;
          padding: 10px;
          width: 200px;
          border-radius: 3px;
          box-shadow: 1px 5px 20px -5px rgba(0, 0, 0, 0.4);
          color: #fff;
          margin-top: 10px;
          cursor: pointer;
        }
        .btn_sign_up {
          background-color: #ef5350;
          border: none;
          padding: 10px;
          width: 200px;
          border-radius: 3px;
          box-shadow: 1px 5px 20px -5px rgba(0, 0, 0, 0.4);
          color: #fff;
          margin-top: 10px;
          cursor: pointer;
        }
        .cont_form_login,
        .cont_form_sign_up {
          position: absolute;
          width: 320px;
          transition: all 0.5s;
        }
        .cont_form_login input,
        .cont_form_sign_up input {
          padding: 15px 5px;
          margin: 20px 0 0 10px;
          width: 260px;
          border: none;
          text-align: left;
          color: #757575;
          border-radius: 4px;
        }
        .cont_form_login h2,
        .cont_form_sign_up h2 {
          font-weight: 400;
          color: #757575;
        }
        .cont_form_login a,
        .cont_form_sign_up a {
          color: #757575;
          position: relative;
          float: left;
          margin: 10px 0 0 30px;
        }
      `}</style>
    </>
  );
}
