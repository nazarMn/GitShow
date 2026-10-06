import React from 'react'
import SettingsSidebar from "@/features/settings/components/SettingsSidebar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { tw } from '@/shared/lib/tailwind';

export default function GlobalSettings() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };
  return (
    <div className={tw("GlobalSettings")}>

      <SettingsSidebar />

      <div className={tw("GlobalSettings-Content")}>

      <div className={tw("GlobalSettings-Main")}>
        <h1>Global settings</h1>
        </div>

          <FontAwesomeIcon icon={faTimes} className={tw("btn-go-home")} onClick={handleGoHome}/>

      </div>

    </div>
  )
}
