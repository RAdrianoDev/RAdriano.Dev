let form = document.getElementById("form");

// Rate limiting: prevent spam submissions
let lastSubmissionTime = 0;
const MIN_SUBMISSION_INTERVAL = 5000; // 5 seconds between submissions

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <div class="toast-content">${message}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  toastContainer.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'fadeOut 0.3s ease-in forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);

  return toast;
}

// Field validation feedback
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}_error`);
  
  if (field && errorElement) {
    field.classList.remove('valid');
    field.classList.add('invalid');
    errorElement.textContent = message;
    errorElement.className = 'field-error';
  }
}

function showFieldSuccess(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}_error`);
  
  if (field && errorElement) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    errorElement.textContent = '';
    errorElement.className = '';
  }
}

function clearFieldFeedback(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}_error`);
  
  if (field && errorElement) {
    field.classList.remove('invalid', 'valid');
    errorElement.textContent = '';
    errorElement.className = '';
  }
}

// Sanitize input to prevent XSS attacks
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format phone number based on digit count
function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If empty, return empty
  if (!digits) return '';
  
  // More than 11 digits, truncate to 11 and format as Brazilian
  if (digits.length > 11) {
    const truncated = digits.slice(0, 11);
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
  }
  
  // 11 digits: Brazilian format (19) 99703-1367
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  
  // 10 digits: Canadian/American format (437) 559-1367
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // If less than 10 digits, format as user types (assume Canadian/American format)
  if (digits.length < 10) {
    if (digits.length <= 3) {
      return digits.length > 0 ? `(${digits}` : digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      // 7-9 digits: (437) 559-1
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  }
  
  return digits;
}

// Validate phone number (optional field, but if provided should be valid)
function isValidPhone(phone) {
  if (!phone || phone.trim() === '') return true; // Optional field
  const digits = phone.replace(/\D/g, '');
  // Accept 10 or 11 digits
  return (digits.length === 10 || digits.length === 11) && /^\d+$/.test(digits);
}

// Validate individual field
function validateField(fieldId, value, isOptional = false) {
  const trimmedValue = value.trim();
  
  switch(fieldId) {
    case 'full_name':
      if (!trimmedValue || trimmedValue.length < 2) {
        showFieldError(fieldId, 'Full name must be at least 2 characters long.');
        return false;
      }
      if (trimmedValue.length > 100) {
        showFieldError(fieldId, 'Full name is too long (max 100 characters).');
        return false;
      }
      showFieldSuccess(fieldId);
      return true;
      
    case 'email':
      if (!trimmedValue) {
        showFieldError(fieldId, 'Email address is required.');
        return false;
      }
      if (!isValidEmail(trimmedValue)) {
        showFieldError(fieldId, 'Please enter a valid email address.');
        return false;
      }
      if (trimmedValue.length > 255) {
        showFieldError(fieldId, 'Email address is too long.');
        return false;
      }
      showFieldSuccess(fieldId);
      return true;
      
    case 'email_subject':
      if (!trimmedValue || trimmedValue.length < 3) {
        showFieldError(fieldId, 'Email subject must be at least 3 characters long.');
        return false;
      }
      if (trimmedValue.length > 200) {
        showFieldError(fieldId, 'Email subject is too long (max 200 characters).');
        return false;
      }
      showFieldSuccess(fieldId);
      return true;
      
    case 'message':
      if (!trimmedValue || trimmedValue.length < 10) {
        showFieldError(fieldId, 'Message must be at least 10 characters long.');
        return false;
      }
      if (trimmedValue.length > 2000) {
        showFieldError(fieldId, 'Message is too long (max 2000 characters).');
        return false;
      }
      showFieldSuccess(fieldId);
      return true;
      
    case 'mobile_number':
      if (trimmedValue === '') {
        clearFieldFeedback(fieldId);
        return true; // Optional field
      }
      const phoneDigits = trimmedValue.replace(/\D/g, '');
      if (!isValidPhone(trimmedValue)) {
        showFieldError(fieldId, 'Please enter a valid phone number (10 or 11 digits).');
        return false;
      }
      if (phoneDigits.length > 11) {
        showFieldError(fieldId, 'Phone number is too long.');
        return false;
      }
      showFieldSuccess(fieldId);
      return true;
      
    default:
      return true;
  }
}

// Validate form inputs
function validateForm(fullName, email, emailSubject, message, mobileNumber) {
  const errors = [];

  // Validate full name
  const sanitizedFullName = sanitizeInput(fullName.value.trim());
  if (!sanitizedFullName || sanitizedFullName.length < 2) {
    errors.push('Full name must be at least 2 characters long.');
  }
  if (sanitizedFullName.length > 100) {
    errors.push('Full name is too long (max 100 characters).');
  }

  // Validate email
  const sanitizedEmail = sanitizeInput(email.value.trim());
  if (!sanitizedEmail || !isValidEmail(sanitizedEmail)) {
    errors.push('Please enter a valid email address.');
  }
  if (sanitizedEmail.length > 255) {
    errors.push('Email address is too long.');
  }

  // Validate subject
  const sanitizedSubject = sanitizeInput(emailSubject.value.trim());
  if (!sanitizedSubject || sanitizedSubject.length < 3) {
    errors.push('Email subject must be at least 3 characters long.');
  }
  if (sanitizedSubject.length > 200) {
    errors.push('Email subject is too long (max 200 characters).');
  }

  // Validate message
  const sanitizedMessage = sanitizeInput(message.value.trim());
  if (!sanitizedMessage || sanitizedMessage.length < 10) {
    errors.push('Message must be at least 10 characters long.');
  }
  if (sanitizedMessage.length > 2000) {
    errors.push('Message is too long (max 2000 characters).');
  }

  // Validate mobile number (optional)
  if (mobileNumber.value.trim() !== '') {
    const phoneDigits = mobileNumber.value.replace(/\D/g, '');
    if (!isValidPhone(mobileNumber.value)) {
      errors.push('Please enter a valid phone number (10 or 11 digits).');
    }
    if (phoneDigits.length > 11) {
      errors.push('Phone number is too long.');
    }
  }

  // Extract only digits from phone number for storage
  const phoneDigits = mobileNumber.value.trim() 
    ? mobileNumber.value.replace(/\D/g, '') 
    : '';

  return { isValid: errors.length === 0, errors, sanitizedData: {
    full_name: sanitizedFullName,
    email: sanitizedEmail,
    email_subject: sanitizedSubject,
    message: sanitizedMessage,
    mobile_number: phoneDigits
  }};
}

// Helper function to calculate new cursor position after formatting
function calculateNewCursorPosition(oldValue, newValue, oldCursorPos) {
  // Count digits before cursor in old value
  const digitsBeforeCursor = oldValue.slice(0, oldCursorPos).replace(/\D/g, '').length;
  
  // Find position in new value where we have the same number of digits
  let digitCount = 0;
  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i])) {
      digitCount++;
      if (digitCount === digitsBeforeCursor) {
        return i + 1;
      }
    }
  }
  
  return newValue.length;
}

// Real-time validation event listeners
document.addEventListener('DOMContentLoaded', () => {
  const fullName = document.getElementById("full_name");
  const email = document.getElementById("email");
  const emailSubject = document.getElementById("email_subject");
  const mobileNumber = document.getElementById("mobile_number");
  const message = document.getElementById("message");

  // Add real-time validation
  if (fullName) {
    fullName.addEventListener('blur', () => {
      validateField('full_name', fullName.value);
    });
    fullName.addEventListener('input', () => {
      if (fullName.value.trim().length >= 2) {
        validateField('full_name', fullName.value);
      } else {
        clearFieldFeedback('full_name');
      }
    });
  }

  if (email) {
    email.addEventListener('blur', () => {
      validateField('email', email.value);
    });
    email.addEventListener('input', () => {
      if (email.value.trim().length > 0) {
        validateField('email', email.value);
      } else {
        clearFieldFeedback('email');
      }
    });
  }

  if (emailSubject) {
    emailSubject.addEventListener('blur', () => {
      validateField('email_subject', emailSubject.value);
    });
    emailSubject.addEventListener('input', () => {
      if (emailSubject.value.trim().length >= 3) {
        validateField('email_subject', emailSubject.value);
      } else {
        clearFieldFeedback('email_subject');
      }
    });
  }

  if (message) {
    message.addEventListener('blur', () => {
      validateField('message', message.value);
    });
    message.addEventListener('input', () => {
      if (message.value.trim().length >= 10) {
        validateField('message', message.value);
      } else {
        clearFieldFeedback('message');
      }
    });
  }

  if (mobileNumber) {
    // Format phone number as user types
    mobileNumber.addEventListener('input', (e) => {
      const input = e.target;
      const cursorPosition = input.selectionStart;
      const oldValue = input.value;
      const digits = oldValue.replace(/\D/g, '');
      
      // Format the phone number
      const formatted = formatPhoneNumber(oldValue);
      
      // Only update if the formatted value is different
      if (formatted !== oldValue) {
        input.value = formatted;
        
        // Adjust cursor position after formatting
        const newCursorPosition = calculateNewCursorPosition(
          oldValue,
          formatted,
          cursorPosition
        );
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }
      
      // Validate if there's content
      if (digits.length > 0) {
        validateField('mobile_number', formatted, true);
      } else {
        clearFieldFeedback('mobile_number');
      }
    });
    
    mobileNumber.addEventListener('blur', () => {
      validateField('mobile_number', mobileNumber.value, true);
    });
    
    // Prevent non-digit characters from being typed (except formatting characters)
    mobileNumber.addEventListener('keydown', (e) => {
      // Allow: backspace, delete, tab, escape, enter, and arrow keys
      if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
          // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true)) {
        return;
      }
      // Ensure that it is a number and stop the keypress if not
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Rate limiting check
  const now = Date.now();
  if (now - lastSubmissionTime < MIN_SUBMISSION_INTERVAL) {
    const waitTime = Math.ceil((MIN_SUBMISSION_INTERVAL - (now - lastSubmissionTime)) / 1000);
    showToast(`Please wait ${waitTime} second${waitTime > 1 ? 's' : ''} before submitting again.`, 'warning', 4000);
    return;
  }

  const fullName = document.getElementById("full_name");
  const email = document.getElementById("email");
  const emailSubject = document.getElementById("email_subject");
  const mobileNumber = document.getElementById("mobile_number");
  const message = document.getElementById("message");
  const submitButton = form.querySelector('button[type="submit"]');

  // Validate all fields before submission
  const isFullNameValid = validateField('full_name', fullName.value);
  const isEmailValid = validateField('email', email.value);
  const isSubjectValid = validateField('email_subject', emailSubject.value);
  const isMessageValid = validateField('message', message.value);
  const isPhoneValid = validateField('mobile_number', mobileNumber.value, true);

  if (!isFullNameValid || !isEmailValid || !isSubjectValid || !isMessageValid || !isPhoneValid) {
    showToast('Please fix the errors in the form before submitting.', 'error', 4000);
    return;
  }

  // Disable submit button to prevent double submissions
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  // Validate form
  const validation = validateForm(fullName, email, emailSubject, message, mobileNumber);
  
  if (!validation.isValid) {
    showToast('Please fix the errors in the form before submitting.', 'error', 4000);
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
    return;
  }

  // API endpoint
  const url = "https://api.radriano.dev/contact";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.sanitizedData),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.error("Error sending message:", result);
      showToast("Error sending message. Please try again later.", 'error', 5000);
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
      return;
    }

    // Update last submission time
    lastSubmissionTime = Date.now();

    // Clear the form and field feedbacks
    fullName.value = "";
    email.value = "";
    emailSubject.value = "";
    mobileNumber.value = "";
    message.value = "";
    
    // Clear all field feedbacks
    ['full_name', 'email', 'email_subject', 'message', 'mobile_number'].forEach(fieldId => {
      clearFieldFeedback(fieldId);
    });

    showToast("Message sent successfully! I'll get back to you soon.", 'success', 5000);
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
  } catch (error) {
    console.error("Network error:", error);
    showToast("Error sending message. Please check your internet connection and try again later.", 'error', 5000);
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
  }
});

