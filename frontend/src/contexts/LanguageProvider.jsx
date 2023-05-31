import {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import LangContext from './LanguageContext';

const LangProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(i18n.language);

  const getLocalLanguage = useCallback(() => JSON.parse(localStorage.getItem('currentLanguage')), []);

  const setCurrentLanguage = useCallback(() => {
    localStorage.setItem('currentLanguage', JSON.stringify(activeLanguage));
  }, [activeLanguage]);

  const setNewLanguage = useCallback(() => {
    const currentLanguage = i18n.language;
    const updatedLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(updatedLanguage);
    setActiveLanguage(updatedLanguage);
    localStorage.setItem('currentLanguage', JSON.stringify(updatedLanguage));
  }, [i18n]);

  useEffect(() => {
    if (!getLocalLanguage()) {
      setCurrentLanguage();
    }
  }, [getLocalLanguage, setCurrentLanguage]);

  const providedData = useMemo(() => ({
    getLocalLanguage,
    activeLanguage,
    setNewLanguage,
  }), [getLocalLanguage, activeLanguage, setNewLanguage]);

  return (
    <LangContext.Provider value={providedData}>
      {children}
    </LangContext.Provider>
  );
};

export default LangProvider;
