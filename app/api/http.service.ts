/**
 * HTTP Service
 * Base HTTP methods wrapper around axios client
 */

import apiClient from './client';
import {RequestConfig, TypedAxiosResponse} from './types';
import API_CONFIG from './config';

class HttpService {
  /**
   * GET request
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<TypedAxiosResponse<T>> {
    const axiosConfig: any = {
      params: config?.params,
      headers: config?.headers,
      timeout: config?.timeout,
      skipAuth: config?.skipAuth,
    };

    return apiClient.get<T>(url, axiosConfig);
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<TypedAxiosResponse<T>> {
    const axiosConfig: any = {
      headers: config?.headers,
      timeout: config?.timeout,
      skipAuth: config?.skipAuth,
    };

    return apiClient.post<T>(url, data, axiosConfig);
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<TypedAxiosResponse<T>> {
    const axiosConfig: any = {
      headers: config?.headers,
      timeout: config?.timeout,
      skipAuth: config?.skipAuth,
    };

    return apiClient.put<T>(url, data, axiosConfig);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<TypedAxiosResponse<T>> {
    const axiosConfig: any = {
      headers: config?.headers,
      timeout: config?.timeout,
      skipAuth: config?.skipAuth,
    };

    return apiClient.patch<T>(url, data, axiosConfig);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<TypedAxiosResponse<T>> {
    const axiosConfig: any = {
      params: config?.params,
      headers: config?.headers,
      timeout: config?.timeout,
      skipAuth: config?.skipAuth,
    };

    return apiClient.delete<T>(url, axiosConfig);
  }

  /**
   * POST with form data
   */
  async postFormData<T = any>(
    url: string,
    data: FormData,
    config?: RequestConfig,
  ): Promise<TypedAxiosResponse<T>> {
    return this.post<T>(url, data, {
      ...config,
      headers: {
        'Content-Type': API_CONFIG.CONTENT_TYPES.FORM_DATA,
        ...config?.headers,
      },
    });
  }

  /**
   * POST with URL encoded form
   */
  async postFormUrlEncoded<T = any>(
    url: string,
    data: URLSearchParams | Record<string, any>,
    config?: RequestConfig,
  ): Promise<TypedAxiosResponse<T>> {
    const formData = data instanceof URLSearchParams ? data : new URLSearchParams(data);

    return this.post<T>(url, formData.toString(), {
      ...config,
      headers: {
        'Content-Type': API_CONFIG.CONTENT_TYPES.FORM_URLENCODED,
        ...config?.headers,
      },
    });
  }
}

export default new HttpService();
