class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.references :chat, null: false, foreign_key: true
      t.string :text
      t.boolean :from_user, index: true

      t.timestamps
    end
  end
end
