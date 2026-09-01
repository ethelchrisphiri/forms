"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const GET_COURSES_URL = '/api/courses';
const POST_REGISTER_URL = '/api/students';

function StudentRegistrationForm() {
  const { data: courses = [], isLoading: isFetching } = useQuery({
    queryKey: ['coursesData'],
    queryFn: async () => {
      try {
        const res = await fetch(GET_COURSES_URL);
        if (!res.ok) throw new Error();
        const json = await res.json();
        
        let rawCourses = [];
        if (Array.isArray(json)) {
          rawCourses = json;
        } else if (json && Array.isArray(json.courses)) {
          rawCourses = json.courses;
        } else if (json && typeof json === 'object') {
          rawCourses = Object.values(json);
        }

        return rawCourses;
      } catch {
        return [
          { id: '1', title: 'Software Engineering' },
          { id: '2', title: 'Data Science' },
          { id: '3', title: 'Cyber Security' }
        ]; 
      }
    }
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(POST_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.status === 409) {
        throw new Error('This student profile or email is already registered!');
      }
      if (!res.ok) throw new Error('Submission failed');
      return res.json();
    },
    onSuccess: () => {
      alert('Student Profile Registered Successfully!');
    },
    onError: (error) => {
      alert(error.message || 'Error connecting to the API route.');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, touchedFields, isSubmitting, isValidating }
  } = useForm({
    mode: 'onChange'
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '580px', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#ffffff', boxSizing: 'border-box' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>Student Registration</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>Fill out your details below to submit your student application enrollment profile.</p>
        </div>

        <div style={{ backgroundColor: '#f1f5f9', padding: '16px 20px', marginBottom: '32px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Form State Monitor</h4>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', color: '#334155' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><strong style={{ color: '#475569' }}>Valid:</strong> {isValid ? 'True' : 'False'}</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><strong style={{ color: '#475569' }}>Invalid:</strong> {Object.keys(errors).length > 0 ? 'True' : 'False'}</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><strong style={{ color: '#475569' }}>Submitting:</strong> {isSubmitting ? 'True' : 'False'}</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><strong style={{ color: '#475569' }}>Validating:</strong> {isValidating ? 'True' : 'False'}</li>
            <li style={{ gridColumn: 'span 2', display: 'flex', gap: '6px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', color: '#475569' }}>
               <strong>Touched Fields:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0f172a' }}>{Object.keys(touchedFields).length > 0 ? Object.keys(touchedFields).join(', ') : 'None'}</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#334155' }}>First Name</label>
              <input {...register('firstName', { required: true })} placeholder="Jane" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', backgroundColor: '#ffffff', transition: 'border-color 0.15s' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#334155' }}>Last Name</label>
              <input {...register('lastName', { required: true })} placeholder="Doe" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', backgroundColor: '#ffffff', transition: 'border-color 0.15s' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#334155' }}>Email Address</label>
            <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} placeholder="hello@akirachix.com" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', backgroundColor: '#ffffff', transition: 'border-color 0.15s' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#334155' }}>Phone Number</label>
            <input {...register('phone', { required: true })} placeholder="+1234567890" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', backgroundColor: '#ffffff', transition: 'border-color 0.15s' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#334155' }}>Date of Birth</label>
              <input type="date" {...register('dob', { required: true })} style={{ width: '100%', padding: '9px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', height: '40px', fontFamily: 'inherit', backgroundColor: '#ffffff' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#334155' }}>Preferred Course</label>
              <select {...register('course', { required: true })} defaultValue="" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', height: '40px', backgroundColor: '#ffffff', fontFamily: 'inherit' }}>
                <option value="" disabled>Select a course...</option>
                {isFetching ? (
                  <option disabled>Loading database options...</option>
                ) : (
                  Array.isArray(courses) && courses.map((c, i) => {
                    const isObject = c && typeof c === 'object';
                    const optionId = isObject ? (c.id || c.code || i.toString()) : c;
                    const optionTitle = isObject ? (c.title || c.name || c.course_name || c.code || 'Course ' + (i + 1)) : c;
                    return (
                      <option key={optionId} value={optionId}>
                        {optionTitle}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!isValid || isSubmitting}
            style={{ width: '100%', padding: '12px', backgroundColor: isValid ? '#2563eb' : '#cbd5e1', color: isValid ? '#ffffff' : '#94a3b8', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '14px', cursor: isValid ? 'pointer' : 'not-allowed', transition: 'background-color 0.15s ease' }}
          >
            {isSubmitting || mutation.isPending ? 'Processing Registration...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Page() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <StudentRegistrationForm />
    </QueryClientProvider>
  );
}
