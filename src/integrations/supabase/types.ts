export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      tabela_ortega: {
        Row: {
          ANO: number | null
          "Base de dados": string | null
          Cancelado: string | null
          CDN: string | null
          Consolidado: number | null
          CRITICIDADE: string | null
          "DATA/HORA \nFIM": string
          "DATA/HORA IN�CIO": string
          "Demanda - Engenharia": string | null
          "Demanda - Global": string | null
          "Demanda - MKT Conte�dos": string | null
          "Demanda - Plataforma": string | null
          DIA: number | null
          Dispositivos: string | null
          "Documenta��o": string | null
          DVB: string | null
          EVENTO: string | null
          "Evento Temporal": string | null
          "Executor da Atividade": string | null
          "Execu��o - GLOBAL": string | null
          "Execu��o Plataforma BR": string | null
          FHR: string | null
          Freeview: string | null
          "ID DE BUSCA": string | null
          "M�S": number | null
          "Novas Cidades": string | null
          "Novos Canais": string | null
          "N�o executado": string | null
          "Observa��es": string | null
          OPCH: string | null
          "Outras Configura��es": string | null
          RDV: string | null
          RHR: string | null
          RWs: string | null
          SCDN: string | null
          SCR: string | null
          SEMANA: number | null
          SEVERIDADE: string | null
          STATUS: string
          SWP: string | null
          "TAREFA (TASK)": string | null
          TASK: string | null
          "TP \nSIGITM": string
          "UDO ID": string | null
          "Valida��o": string | null
          VSA: string | null
          VSPP: string | null
          "�rea Solicitante": string | null
        }
        Insert: {
          ANO?: number | null
          "Base de dados"?: string | null
          Cancelado?: string | null
          CDN?: string | null
          Consolidado?: number | null
          CRITICIDADE?: string | null
          "DATA/HORA \nFIM": string
          "DATA/HORA IN�CIO": string
          "Demanda - Engenharia"?: string | null
          "Demanda - Global"?: string | null
          "Demanda - MKT Conte�dos"?: string | null
          "Demanda - Plataforma"?: string | null
          DIA?: number | null
          Dispositivos?: string | null
          "Documenta��o"?: string | null
          DVB?: string | null
          EVENTO?: string | null
          "Evento Temporal"?: string | null
          "Executor da Atividade"?: string | null
          "Execu��o - GLOBAL"?: string | null
          "Execu��o Plataforma BR"?: string | null
          FHR?: string | null
          Freeview?: string | null
          "ID DE BUSCA"?: string | null
          "M�S"?: number | null
          "Novas Cidades"?: string | null
          "Novos Canais"?: string | null
          "N�o executado"?: string | null
          "Observa��es"?: string | null
          OPCH?: string | null
          "Outras Configura��es"?: string | null
          RDV?: string | null
          RHR?: string | null
          RWs?: string | null
          SCDN?: string | null
          SCR?: string | null
          SEMANA?: number | null
          SEVERIDADE?: string | null
          STATUS: string
          SWP?: string | null
          "TAREFA (TASK)"?: string | null
          TASK?: string | null
          "TP \nSIGITM": string
          "UDO ID"?: string | null
          "Valida��o"?: string | null
          VSA?: string | null
          VSPP?: string | null
          "�rea Solicitante"?: string | null
        }
        Update: {
          ANO?: number | null
          "Base de dados"?: string | null
          Cancelado?: string | null
          CDN?: string | null
          Consolidado?: number | null
          CRITICIDADE?: string | null
          "DATA/HORA \nFIM"?: string
          "DATA/HORA IN�CIO"?: string
          "Demanda - Engenharia"?: string | null
          "Demanda - Global"?: string | null
          "Demanda - MKT Conte�dos"?: string | null
          "Demanda - Plataforma"?: string | null
          DIA?: number | null
          Dispositivos?: string | null
          "Documenta��o"?: string | null
          DVB?: string | null
          EVENTO?: string | null
          "Evento Temporal"?: string | null
          "Executor da Atividade"?: string | null
          "Execu��o - GLOBAL"?: string | null
          "Execu��o Plataforma BR"?: string | null
          FHR?: string | null
          Freeview?: string | null
          "ID DE BUSCA"?: string | null
          "M�S"?: number | null
          "Novas Cidades"?: string | null
          "Novos Canais"?: string | null
          "N�o executado"?: string | null
          "Observa��es"?: string | null
          OPCH?: string | null
          "Outras Configura��es"?: string | null
          RDV?: string | null
          RHR?: string | null
          RWs?: string | null
          SCDN?: string | null
          SCR?: string | null
          SEMANA?: number | null
          SEVERIDADE?: string | null
          STATUS?: string
          SWP?: string | null
          "TAREFA (TASK)"?: string | null
          TASK?: string | null
          "TP \nSIGITM"?: string
          "UDO ID"?: string | null
          "Valida��o"?: string | null
          VSA?: string | null
          VSPP?: string | null
          "�rea Solicitante"?: string | null
        }
        Relationships: []
      }
      testeinsano: {
        Row: {
          ANO: number | null
          "Base de dados": string | null
          Cancelado: string | null
          CDN: string | null
          Consolidado: number | null
          CRITICIDADE: string | null
          "DATA/HORA \nFIM": string | null
          "DATA/HORA IN�CIO": string | null
          "Demanda - Engenharia": string | null
          "Demanda - Global": string | null
          "Demanda - MKT Conte�dos": string | null
          "Demanda - Plataforma": string | null
          DIA: number | null
          Dispositivos: string | null
          "Documenta��o": string | null
          DVB: string | null
          EVENTO: string | null
          "Evento Temporal": string | null
          "Executor da Atividade": string | null
          "Execu��o - GLOBAL": string | null
          "Execu��o Plataforma BR": string | null
          FHR: string | null
          Freeview: string | null
          "ID DE BUSCA": string | null
          "M�S": number | null
          "Novas Cidades": string | null
          "Novos Canais": string | null
          "N�o executado": string | null
          "Observa��es": string | null
          OPCH: string | null
          "Outras Configura��es": string | null
          RDV: string | null
          RHR: string | null
          RWs: string | null
          SCDN: string | null
          SCR: string | null
          SEMANA: number | null
          SEVERIDADE: string | null
          STATUS: string | null
          SWP: string | null
          "TAREFA (TASK)": string | null
          TASK: string | null
          "TP \nSIGITM": string | null
          "UDO ID": string | null
          "Valida��o": string | null
          VSA: string | null
          VSPP: string | null
          "�rea Solicitante": string | null
        }
        Insert: {
          ANO?: number | null
          "Base de dados"?: string | null
          Cancelado?: string | null
          CDN?: string | null
          Consolidado?: number | null
          CRITICIDADE?: string | null
          "DATA/HORA \nFIM"?: string | null
          "DATA/HORA IN�CIO"?: string | null
          "Demanda - Engenharia"?: string | null
          "Demanda - Global"?: string | null
          "Demanda - MKT Conte�dos"?: string | null
          "Demanda - Plataforma"?: string | null
          DIA?: number | null
          Dispositivos?: string | null
          "Documenta��o"?: string | null
          DVB?: string | null
          EVENTO?: string | null
          "Evento Temporal"?: string | null
          "Executor da Atividade"?: string | null
          "Execu��o - GLOBAL"?: string | null
          "Execu��o Plataforma BR"?: string | null
          FHR?: string | null
          Freeview?: string | null
          "ID DE BUSCA"?: string | null
          "M�S"?: number | null
          "Novas Cidades"?: string | null
          "Novos Canais"?: string | null
          "N�o executado"?: string | null
          "Observa��es"?: string | null
          OPCH?: string | null
          "Outras Configura��es"?: string | null
          RDV?: string | null
          RHR?: string | null
          RWs?: string | null
          SCDN?: string | null
          SCR?: string | null
          SEMANA?: number | null
          SEVERIDADE?: string | null
          STATUS?: string | null
          SWP?: string | null
          "TAREFA (TASK)"?: string | null
          TASK?: string | null
          "TP \nSIGITM"?: string | null
          "UDO ID"?: string | null
          "Valida��o"?: string | null
          VSA?: string | null
          VSPP?: string | null
          "�rea Solicitante"?: string | null
        }
        Update: {
          ANO?: number | null
          "Base de dados"?: string | null
          Cancelado?: string | null
          CDN?: string | null
          Consolidado?: number | null
          CRITICIDADE?: string | null
          "DATA/HORA \nFIM"?: string | null
          "DATA/HORA IN�CIO"?: string | null
          "Demanda - Engenharia"?: string | null
          "Demanda - Global"?: string | null
          "Demanda - MKT Conte�dos"?: string | null
          "Demanda - Plataforma"?: string | null
          DIA?: number | null
          Dispositivos?: string | null
          "Documenta��o"?: string | null
          DVB?: string | null
          EVENTO?: string | null
          "Evento Temporal"?: string | null
          "Executor da Atividade"?: string | null
          "Execu��o - GLOBAL"?: string | null
          "Execu��o Plataforma BR"?: string | null
          FHR?: string | null
          Freeview?: string | null
          "ID DE BUSCA"?: string | null
          "M�S"?: number | null
          "Novas Cidades"?: string | null
          "Novos Canais"?: string | null
          "N�o executado"?: string | null
          "Observa��es"?: string | null
          OPCH?: string | null
          "Outras Configura��es"?: string | null
          RDV?: string | null
          RHR?: string | null
          RWs?: string | null
          SCDN?: string | null
          SCR?: string | null
          SEMANA?: number | null
          SEVERIDADE?: string | null
          STATUS?: string | null
          SWP?: string | null
          "TAREFA (TASK)"?: string | null
          TASK?: string | null
          "TP \nSIGITM"?: string | null
          "UDO ID"?: string | null
          "Valida��o"?: string | null
          VSA?: string | null
          VSPP?: string | null
          "�rea Solicitante"?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
