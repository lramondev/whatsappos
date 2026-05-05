export class CustomAction {

  static add() {
    return {
      name: 'add',
      title: 'Adicionar',
      icon: 'add'
    }
  }

  static edit() {
    return {
      name: 'edit',
      title: 'Editar',
      icon: 'edit'
    }
  }

  static delete() {
    return {
      name: 'delete',
      title: 'Excluir',
      icon: 'delete'
    }
  }

  static inactive() {
    return {
      name: 'inactive',
      title: 'Desativar',
      icon: 'pause_circle'
    }
  }

  static active() {
    return {
      name: 'inactive',
      title: 'Ativar',
      icon: 'play_circle'
    }
  }

  static cancel() {
    return {
      name: 'inactive',
      title: 'Cancelar',
      icon: 'block'
    }
  }

  static approve() {
    return {
      name: 'approve',
      title: 'Aprovar',
      icon: 'check_circle'
    }
  }

  static disapprove() {
    return {
      name: 'approve',
      title: 'Desaprovar',
      icon: 'settings_backup_restore'
    }
  }

  static close() {
   return {
      name: 'close',
      title: 'Encerrar',
      icon: 'do_not_disturb_on'
    }
  }

  static open() {
    return {
      name: 'open',
      title: 'Abrir',
      icon: 'lock_open_circle'
    }
  }
  
  static print() {
    return {
      name: 'print',
      title: 'Imprimir',
      icon: 'print'
    }
  }

  static import() {
    return {
      name: 'print',
      title: 'Importar',
      icon: 'print'
    }
  }

  static export() {
    return {
      name: 'print',
      title: 'Exportar',
      icon: 'print'
    }
  }  
  
  static history() {
    return {
      name: 'history',
      title: 'Histórico',
      icon: 'history'
    }
  }
}