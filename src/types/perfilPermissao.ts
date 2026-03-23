export type ModulosPerfilPermissoes = {
  id_modulo: number;
  id_parent: number;
  name_form_page: string;
  component_indx: string;
  component_name: string;
  component_text: string;
  component_event?: string;
  shortcutkeys?: string;
  action_insert: number;
  action_update: number;
  action_search: number;
  action_delete: number;
  action_print: number;
};
