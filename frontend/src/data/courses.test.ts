import { describe, it, expect } from 'vitest';
import { COURSES, getCourseById, COUNTRY_CODES } from './courses.js';

describe('Course Catalog Specification & Integrity', () => {
  const REQUIRED_COURSES = [
    'Mathematics',
    'Science',
    'Arithmetic',
    'Cyber Security',
    'Web Development',
    'Python Programming',
  ];

  it('should contain all 6 required courses', () => {
    const courseNames = COURSES.map((c) => c.name);
    REQUIRED_COURSES.forEach((requiredName) => {
      expect(courseNames).toContain(requiredName);
    });
    expect(COURSES.length).toBe(6);
  });

  it('should have complete educational metadata and outcomes for every course', () => {
    COURSES.forEach((course) => {
      expect(course.id).toBeDefined();
      expect(course.name.trim().length).toBeGreaterThan(0);
      expect(course.shortDescription.trim().length).toBeGreaterThan(20);
      expect(course.fullDescription.trim().length).toBeGreaterThan(40);
      expect(course.learningOutcomes.length).toBeGreaterThanOrEqual(3);
      expect(course.ageRange).toBeDefined();
      expect(course.grades).toBeDefined();
      expect(course.prerequisites).toBeDefined();
      expect(course.totalSessions).toBeDefined();
      expect(course.durationPerClass).toBeDefined();
    });
  });

  it('should include clearly identified demo/sample catalog pricing with disclaimers', () => {
    COURSES.forEach((course) => {
      expect(course.pricing).toBeDefined();
      expect(course.pricing.amount).toBeGreaterThan(0);
      expect(course.pricing.currency).toBe('USD');
      expect(course.pricing.currencySymbol).toBe('$');
      expect(course.pricing.billingPeriod).toBeDefined();
      expect(course.pricing.isSample).toBe(true);
      expect(course.pricing.disclaimer).toMatch(/sample|demo/i);
    });
  });

  it('should retrieve course by id or name correctly using getCourseById', () => {
    const python = getCourseById('python-programming');
    expect(python).toBeDefined();
    expect(python?.name).toBe('Python Programming');

    const math = getCourseById('Mathematics');
    expect(math).toBeDefined();
    expect(math?.id).toBe('mathematics');

    const unknown = getCourseById('non-existent-course');
    expect(unknown).toBeUndefined();
  });

  it('should provide common country codes for phone number input', () => {
    expect(COUNTRY_CODES.length).toBeGreaterThanOrEqual(5);
    const usCode = COUNTRY_CODES.find((c) => c.code === '+1');
    const ukCode = COUNTRY_CODES.find((c) => c.code === '+44');
    const inCode = COUNTRY_CODES.find((c) => c.code === '+91');

    expect(usCode).toBeDefined();
    expect(ukCode).toBeDefined();
    expect(inCode).toBeDefined();
  });
});
