import { Currency, getCurrencies } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface CurrencyContextType {
    currencies: Currency[] | null;
    currency: Currency | null;
    isLoading: boolean;
    updateCurrency: () => Promise<void>;
    formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currency, setCurrency] = useState<Currency | null>(null);
    const [currencies, setCurrencies] = useState<Currency[]>([]);

        useEffect(() => {
        const fetchCurrencies = async () => {
          try {
            const data = await getCurrencies(); // base = MGA par défaut
            setCurrencies(data);
          } catch (error) {
            console.error(error);
          } 
        };
        fetchCurrencies();
      }, []); 

     useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedCurrency = await AsyncStorage.getItem('@app_currency');
                if (savedCurrency) {
                    const parsed = JSON.parse(savedCurrency);
                    const found = currencies.find(c => c.value === parsed.value);
                    if (found) setCurrency(found);
                }
            } catch (e) {
                console.error('Failed to load settings', e);
            }
        };
        loadSettings();
    }, [currencies]);


    const updateCurrency = async (currency: Currency) => {
        setIsLoading(true);
        try {
            setCurrency(currency);
            await AsyncStorage.setItem('@app_currency', JSON.stringify(currency));
            console.log('Currency updated:', currency);
        } catch (e) {
            console.error('Failed to save currency', e);
        }
    }

    const formatCurrency = (amount: number): string => {
    if (!currency) return amount.toString();
    const convertedAmount = amount * currency.rate;
    const formattedNumber = new Intl.NumberFormat('fr-FR').format(convertedAmount);
    return `${formattedNumber} ${currency.value}`;
    };

    
    return (
        <CurrencyContext.Provider value={{ currency, isLoading, updateCurrency, formatCurrency, currencies }}>
            {children}
        </CurrencyContext.Provider>
    );
    
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within an CurrencyProvider');
    }
    return context;
};


