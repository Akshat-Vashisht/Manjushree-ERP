import React from 'react'

function FormFieldError({ message = '' }) {
  return (
    <div className='text-red-500 font-medium text-sm'>
        {message}
    </div>
  )
}

export default FormFieldError