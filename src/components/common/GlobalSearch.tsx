import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  type AutocompleteRenderOptionState,
  type SxProps,
  type Theme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { GlobalTypography } from './GlobalTypography';

export interface GlobalSearchProps<T> {
  fetchOptions?: (query: string, signal: AbortSignal) => Promise<T[]>;
  options?: T[];
  filterOption?: (option: T, query: string) => boolean;
  getOptionLabel?: (option: T) => string;
  getOptionKey?: (option: T) => string | number;
  renderOptionContent?: (option: T, state: AutocompleteRenderOptionState) => React.ReactNode;
  onSelect?: (option: T | null) => void;
  onQueryChange?: (query: string) => void;
  value?: string;
  placeholder?: string;
  minQueryLength?: number;
  debounceMs?: number;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  disabled?: boolean;
  cacheSize?: number;
  noOptionsText?: React.ReactNode;
  loadingText?: React.ReactNode;
  sx?: SxProps<Theme>;
}

function GlobalSearchInner<T>(
  {
    fetchOptions,
    options: staticOptions,
    filterOption,
    getOptionLabel: customGetOptionLabel,
    getOptionKey,
    renderOptionContent,
    onSelect,
    onQueryChange,
    value = '',
    placeholder = 'Buscar...',
    minQueryLength = 1,
    debounceMs = 280,
    size = 'small',
    fullWidth = true,
    disabled = false,
    cacheSize = 30,
    noOptionsText: customNoOptionsText,
    loadingText: customLoadingText,
    sx,
  }: GlobalSearchProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [prevValue, setPrevValue] = useState<string>(value);
  const [inputValue, setInputValue] = useState<string>(value);
  const [dynamicOptions, setDynamicOptions] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(value);
  }

  const cacheRef = useRef<Map<string, T[]>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cache = cacheRef.current;
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      cache.clear();
    };
  }, []);

  const getOptionLabel = useCallback(
    (option: T): string => {
      if (customGetOptionLabel) {
        return customGetOptionLabel(option);
      }
      if (typeof option === 'string') return option;
      if (!option || typeof option !== 'object') return String(option);
      const obj = option as Record<string, unknown>;
      if (typeof obj.codigoProducto === 'string') {
        return `${obj.codigoProducto}${obj.nombreCliente ? ` - ${obj.nombreCliente}` : ''}`;
      }
      if (typeof obj.nombre === 'string') {
        return `${obj.nombre}${obj.email ? ` (${obj.email})` : ''}`;
      }
      if (typeof obj.label === 'string') return obj.label;
      if (typeof obj.name === 'string') return obj.name;
      if (typeof obj.title === 'string') return obj.title;
      if (obj.id !== undefined && obj.id !== null) return String(obj.id);
      return String(option);
    },
    [customGetOptionLabel]
  );

  const executeSearch = useCallback(
    async (queryTerm: string) => {
      if (!fetchOptions) return;

      const normalizedQuery = queryTerm.trim();

      if (normalizedQuery.length < minQueryLength) {
        setDynamicOptions([]);
        setIsLoading(false);
        return;
      }

      const cached = cacheRef.current.get(normalizedQuery);
      if (cached) {
        setDynamicOptions(cached);
        setIsLoading(false);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);

      try {
        const results = await fetchOptions(normalizedQuery, controller.signal);

        if (!controller.signal.aborted) {
          if (cacheRef.current.size >= cacheSize) {
            const firstKey = cacheRef.current.keys().next().value;
            if (firstKey !== undefined) {
              cacheRef.current.delete(firstKey);
            }
          }
          cacheRef.current.set(normalizedQuery, results);
          setDynamicOptions(results);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (!controller.signal.aborted) {
          setDynamicOptions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [fetchOptions, minQueryLength, cacheSize]
  );

  const handleInputChange = useCallback(
    (_: React.SyntheticEvent, newInputValue: string, reason: string) => {
      if (reason === 'reset' && !newInputValue) {
        setInputValue('');
        setDynamicOptions([]);
        onQueryChange?.('');
        return;
      }

      setInputValue(newInputValue);
      onQueryChange?.(newInputValue);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!newInputValue.trim()) {
        setDynamicOptions([]);
        setIsLoading(false);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        return;
      }

      if (fetchOptions) {
        debounceTimerRef.current = setTimeout(() => {
          executeSearch(newInputValue);
        }, debounceMs);
      }
    },
    [onQueryChange, fetchOptions, executeSearch, debounceMs]
  );

  const handleOptionSelect = useCallback(
    (_: React.SyntheticEvent, selectedItem: string | T | null) => {
      setIsOpen(false);
      if (!selectedItem) {
        setInputValue('');
        setDynamicOptions([]);
        onSelect?.(null);
        return;
      }

      if (typeof selectedItem === 'string') {
        setInputValue(selectedItem);
        return;
      }

      const label = getOptionLabel(selectedItem);
      setInputValue(label);
      onSelect?.(selectedItem);
    },
    [getOptionLabel, onSelect]
  );

  const handleClear = useCallback(() => {
    setInputValue('');
    setDynamicOptions([]);
    setIsOpen(false);
    onQueryChange?.('');
    onSelect?.(null);
  }, [onQueryChange, onSelect]);

  const currentOptions = useMemo(() => {
    if (staticOptions) {
      const q = inputValue.trim().toLowerCase();
      if (q.length < minQueryLength) return [];
      return staticOptions.filter((opt) => {
        if (filterOption) return filterOption(opt, q);
        return getOptionLabel(opt).toLowerCase().includes(q);
      });
    }
    return dynamicOptions;
  }, [staticOptions, inputValue, minQueryLength, filterOption, getOptionLabel, dynamicOptions]);

  const noOptionsContent = useMemo(
    () => (
      customNoOptionsText !== undefined ? (
        typeof customNoOptionsText === 'string' ? (
          <GlobalTypography
            variant="body2"
            sx={{
              py: 2,
              px: 1,
              textAlign: 'center',
              color: '#64748B',
              fontWeight: 500,
            }}
          >
            {customNoOptionsText}
          </GlobalTypography>
        ) : (
          customNoOptionsText
        )
      ) : (
        <GlobalTypography
          variant="body2"
          sx={{
            py: 2,
            px: 1,
            textAlign: 'center',
            color: '#64748B',
            fontWeight: 500,
          }}
        >
          No se tienen resultados que coincidan con los criterios de búsqueda
        </GlobalTypography>
      )
    ),
    [customNoOptionsText]
  );

  const loadingContent = useMemo(
    () => (
      customLoadingText !== undefined ? (
        typeof customLoadingText === 'string' ? (
          <GlobalTypography variant="body2" sx={{ color: '#94A3B8', py: 1, textAlign: 'center' }}>
            {customLoadingText}
          </GlobalTypography>
        ) : (
          customLoadingText
        )
      ) : (
        <GlobalTypography variant="body2" sx={{ color: '#94A3B8', py: 1, textAlign: 'center' }}>
          Consultando...
        </GlobalTypography>
      )
    ),
    [customLoadingText]
  );

  const renderOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: T, state: AutocompleteRenderOptionState) => {
      const key = getOptionKey
        ? getOptionKey(option)
        : (option as Record<string, unknown>)?.id ?? getOptionLabel(option);

      return (
        <Box
          component="li"
          {...props}
          key={String(key)}
          sx={{
            py: 1.2,
            px: 2,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: '#FDF2F8 !important',
            },
            '&.Mui-focused': {
              backgroundColor: '#FCE7F3 !important',
            },
          }}
        >
          {renderOptionContent ? (
            renderOptionContent(option, state)
          ) : (
            <GlobalTypography variant="body2" sx={{ color: '#0F172A', fontWeight: 500 }}>
              {getOptionLabel(option)}
            </GlobalTypography>
          )}
        </Box>
      );
    },
    [getOptionKey, getOptionLabel, renderOptionContent]
  );

  const isSearchable = Boolean(fetchOptions || staticOptions);
  const shouldOpen = isOpen && isSearchable && (inputValue.trim().length >= minQueryLength || currentOptions.length > 0);

  return (
    <Autocomplete
      ref={ref}
      freeSolo
      disabled={disabled}
      fullWidth={fullWidth}
      open={shouldOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleOptionSelect}
      options={currentOptions}
      filterOptions={(x) => x}
      getOptionLabel={(opt) => (typeof opt === 'string' ? opt : getOptionLabel(opt))}
      noOptionsText={noOptionsContent}
      loading={isLoading}
      loadingText={loadingContent}
      slotProps={{
        paper: {
          elevation: 4,
          sx: {
            borderRadius: 2,
            mt: 0.8,
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
            overflow: 'hidden',
          },
        },
      }}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          size={size}
          placeholder={placeholder}
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#CBD5E1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#E10098',
              },
            },
            ...sx,
          }}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                  {params.slotProps.input.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress size={18} sx={{ color: '#E10098', mr: 0.5 }} />
                  ) : null}
                  {inputValue ? (
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      edge="end"
                      aria-label="Limpiar búsqueda"
                      sx={{ color: '#94A3B8', p: 0.5, mr: 0.25 }}
                    >
                      <ClearIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  ) : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}

export const GlobalSearch = memo(forwardRef(GlobalSearchInner)) as <T>(
  props: GlobalSearchProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

export default GlobalSearch;
